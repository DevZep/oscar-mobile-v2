import React, { Component }                   from 'react'
import { connect }                            from 'react-redux'
import Swiper                                 from 'react-native-swiper'
import { Button, CheckBox }                   from 'react-native-elements'
import HTMLView                               from 'react-native-htmlview'
import { Navigation }                         from 'react-native-navigation'
import ImagePicker                            from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Icon                                   from 'react-native-vector-icons/MaterialIcons'

import * as AssessmentHelper                  from '../helpers'
import { createTask, deleteTask }             from '../../../redux/actions/tasks'
import { createAssessment, updateAssessment } from '../../../redux/actions/assessments'
import i18n                                   from '../../../i18n'
import { SCORE_COLOR }                        from '../../../constants/colors'
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native'

import styles from './styles'

const MAX_UPLOAD_SIZE = 30000
class AssessmentForm extends Component {
  state = {
    attachmentsSize: 0,
    assessmentDomains: [],
    incompletedDomainIds: [],
    currentDomain: 0
  }

  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_ASSESSMENT') {
      if (this.handleValidationSaveDraft()) {
        const { action, assessment, client, previousComponentId, custom_domain } = this.props
        const { assessmentDomains } = this.state
        const params = { assessmentDomains, default: !custom_domain }

        if (action === 'create') {
          this.props.createAssessment(params, client, previousComponentId, this.props.alertMessage())
        } else {
          this.props.updateAssessment(params, assessment.id, client, previousComponentId, this.props.alertMessage())
        }
      }
    }
  }

  componentWillMount() {
    const { domains, client, assessment } = this.props
    const assessmentDomains = AssessmentHelper.populateAssessmentDomains(assessment, domains, client)
    const scores = this.shuffleScores()
    this.setState({ assessmentDomains, scores })
  }

  componentDidMount() {
    if (this.props.action !== 'update') return

    const { assessment } = this.props
    const attachmentsSize = AssessmentHelper.calculateAttachmentsSize(assessment)
    const incompletedDomainIds = AssessmentHelper.incompletedDomainIds(assessment)

    this.setState({ incompletedDomainIds, attachmentsSize })
  }

  saveAssessment() {
    const { action, assessment, client, previousComponentId, custom_domain } = this.props
    const { assessmentDomains } = this.state

    const params = { assessmentDomains, default: !custom_domain }

    if (action === 'create') {
      this.props.createAssessment(params, client, previousComponentId, this.props.onCreateSuccess)
    } else {
      this.props.updateAssessment(params, assessment.id, client, previousComponentId, this.onUpdateSuccess)
    }
  }

  onUpdateSuccess = client => {
    const { assessment } = this.props
    const { assessmentDomains } = this.state
    this.props.alertMessage()
    this.props.onUpdateSuccess(client, { ...assessment, assessment_domain: assessmentDomains })
  }

  setAssessmentDomainField = (assessmentDomain, key, value) => {
    let { assessmentDomains } = this.state

    assessmentDomains = assessmentDomains.map(ad => {
      if (ad.domain_id === assessmentDomain.domain_id) ad = { ...ad, [key]: value }
      return ad
    })

    this.setState({ assessmentDomains })
  }

  setRequireTaskLast = (assessmentDomain, addInLastStep) => {
    let { incompletedDomainIds } = this.state
    if (addInLastStep) incompletedDomainIds.push(assessmentDomain.domain_id)
    else incompletedDomainIds = incompletedDomainIds.filter(id => id != assessmentDomain.domain_id)

    this.setAssessmentDomainField(assessmentDomain, 'required_task_last', addInLastStep)
    this.setState({ incompletedDomainIds })
  }

  uploadAttachment = assessmentDomain => {
    const options = {
      noData: true,
      title: 'Select Document',
      customButtons: [{ name: 'Document', title: 'Choose Document from Library ...' }],
      storageOptions: {
        cameraRoll: true,
        waitUntilSaved: true
      }
    }

    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        alert('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        this.selectAllFile(assessmentDomain)
      } else if (response.didCancel) {
      } else {
        this.handleSelectedFile(response, assessmentDomain)
      }
    })
  }

  selectAllFile = assessmentDomain => {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (error === null && res.uri != null) {
          const type = res.fileName.substring(res.fileName.lastIndexOf('.') + 1)
          if ('jpg jpeg png doc docx xls xlsx pdf'.includes(type)) {
            this.handleSelectedFile(res, assessmentDomain)
          } else {
            Alert.alert('Invalid file type', 'Allow only : jpg jpeg png doc docx xls xlsx pdf')
          }
        }
      }
    )
  }

  handleSelectedFile = (response, assessmentDomain) => {
    let { assessmentDomains, attachmentsSize } = this.state
    const fileSize = response.fileSize / 1024
    attachmentsSize += fileSize

    if (attachmentsSize > MAX_UPLOAD_SIZE) {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    } else {
      const filePath = response.path != undefined ? `file://${response.path}` : response.uri
      const fileName = Platform.OS === 'android' ? response.fileName : response.uri.split('/').pop()

      const source = {
        uri: response.uri,
        path: filePath,
        name: fileName,
        type: response.type,
        size: fileSize
      }

      assessmentDomains = assessmentDomains.map(element => {
        return element.domain_id === assessmentDomain.domain_id ? { ...element, attachments: element.attachments.concat(source) } : element
      })

      this.setState({ attachmentsSize, assessmentDomains })
    }
  }

  removeAttactment = (assessmentDomain, index) => {
    let { assessmentDomains } = this.state
    let attachments = assessmentDomain.attachments
    attachments = attachments.filter((attachment, attIndex) => attIndex !== index)

    assessmentDomains = assessmentDomains.map(ad => {
      return ad.domain_id === assessmentDomain.domain_id ? { ...ad, attachments } : ad
    })

    this.setState({ assessmentDomains })
  }

  openTaskModal = domain => {
    const { client, translations } = this.props
    const taskFormTranslations = translations.client.tasks.form
    Navigation.showModal({
      component: {
        name: 'oscar.taskForm',
        passProps: {
          domain,
          formTranslations: taskFormTranslations,
          onCreateTask: params => this.props.createTask(params, client.id, task => this.handleTaskUpdate(task, 'create'))
        }
      }
    })
  }

  deleteTask = task => {
    const { client } = this.props
    this.props.deleteTask(task, client.id, task => this.handleTaskUpdate(task, 'delete'))
  }

  handleTaskUpdate = (task, action) => {
    let { assessmentDomains } = this.state

    assessmentDomains = assessmentDomains.map(ad => {
      if (ad.domain.id === task.domain.id) if (action === 'create') ad.incomplete_tasks = ad.incomplete_tasks.concat(task)

      if (action === 'delete') ad.incomplete_tasks = ad.incomplete_tasks.filter(t => t.id !== task.id)

      return ad
    })

    this.setState({ assessmentDomains })
  }

  handleValidationSaveDraft = () => {
    const { assessmentDomains, currentDomain } = this.state
    const assessmentDomain = assessmentDomains[currentDomain]

    if (assessmentDomain == undefined) return true

    const domainName = assessmentDomain.domain.name

    if (!assessmentDomain.score) {
      return this.handleSaveDraftValidationFail(domainName, 'score')
    }

    if (!assessmentDomain.reason) {
      return this.handleSaveDraftValidationFail(domainName, 'observation')
    }

    if (this.isRequireGoal(assessmentDomain) && !assessmentDomain.goal) {
      return this.handleSaveDraftValidationFail(domainName, 'goal')
    }

    if (this.isRequireTask(assessmentDomain) && !assessmentDomain.required_task_last) {
      return this.handleSaveDraftValidationFail(domainName, 'task')
    }
    return true
  }

  handleValidation = (e, state, context) => {
    if (state.index == 0) return
    const previousIndex = state.index - 1
    const { assessmentDomains } = this.state
    const assessmentDomain = assessmentDomains[previousIndex]
    const domainName = assessmentDomain.domain.name

    if (!assessmentDomain.score) {
      this.handleValidationFail(domainName, 'score')
      return
    }

    if (!assessmentDomain.reason) {
      this.handleValidationFail(domainName, 'observation')
      return
    }

    if (this.isRequireGoal(assessmentDomain) && !assessmentDomain.goal) {
      this.handleValidationFail(domainName, 'goal')
      return
    }

    if (this.isRequireTask(assessmentDomain) && !assessmentDomain.required_task_last) {
      this.handleValidationFail(domainName, 'task')
    }

    this.setState({currentDomain: state.index})
  }

  handleValidationFail = (domainName, field) => {
    const message =
      field === 'task'
        ? i18n.t('client.assessment_form.warning_tasks', { domainName })
        : i18n.t('client.assessment_form.warning_domain', { title: field, domainName })

    const title = field === 'task' ? i18n.t('client.assessment_form.title_task') : i18n.t('client.assessment_form.title_domain')

    Alert.alert(title, message)
    this._swiper.scrollBy(-1)
  }

  handleSaveDraftValidationFail = (domainName, field) => {
    const message =
      field === 'task'
        ? i18n.t('client.assessment_form.warning_tasks', { domainName })
        : i18n.t('client.assessment_form.warning_domain', { title: field, domainName })

    const title = field === 'task' ? i18n.t('client.assessment_form.title_task') : i18n.t('client.assessment_form.title_domain')

    Alert.alert(title, message)
    return false
  }

  isRequireGoal = assessmentDomain => {
    if (!assessmentDomain.score) return false

    const score = this.getScoreInfo(assessmentDomain)
    return score.colorCode !== 'primary' || score.colorCode === 'primary' && assessmentDomain.goal_required
  }

  isRequireTask = assessmentDomain => {
    if (!assessmentDomain.score) return false

    const score = this.getScoreInfo(assessmentDomain)
    const hasTasks = assessmentDomain.incomplete_tasks.length > 0

    return ['danger', 'warning'].includes(score.colorCode) && !hasTasks
  }

  getScoreInfo = assessmentDomain => {
    const { domain, score } = assessmentDomain
    const scoreInfo = domain[`score_${score}`]
    const colorCode = scoreInfo ? scoreInfo.color : ''
    const definition = scoreInfo ? scoreInfo.definition : ''

    return {
      colorCode,
      color: SCORE_COLOR[colorCode],
      definition
    }
  }

  openDomainDescriptionModal(domain) {
    Navigation.showModal({
      component: {
        name: 'oscar.domainDescriptionModal',
        passProps: { domain }
      }
    })
  }

  shuffleScores = () => {
    return [1,2,3,4].sort(() => Math.random() - 0.5)
  }

  setAssessmentDomainScore = (assessmentDomain, score) => {
    let { assessmentDomains } = this.state
    let goalRequired = true
    goalRequired = (score == 4) ? assessmentDomain.goal_required : true
    assessmentDomains = assessmentDomains.map(ad => {
      if (ad.domain_id === assessmentDomain.domain_id) ad = { ...ad, score: score,  goal_required: goalRequired}
      return ad
    })

    this.setState({ assessmentDomains })
  }

  renderButtonScore = assessmentDomain => (
    <View style={styles.buttonContainer}>
      { this.state.scores.map(score => {
        const newAd = { ...assessmentDomain, score }
        const scoreInfo = this.getScoreInfo(newAd)
        const label = scoreInfo.definition ? scoreInfo.definition : score
        // const color = assessmentDomain.score == score ? scoreInfo.color : '#bfbfbf'
        const color = assessmentDomain.score == score ? '#009999' : '#bfbfbf'

        return (
          <TouchableOpacity key={score} onPress={() => this.setAssessmentDomainScore(assessmentDomain, score)}>
            <View style={[styles.button, { backgroundColor: color }]}>
              <Text style={styles.buttonText}>{label}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )

  renderIncompletedTask = ({ incomplete_tasks }, assessmentFormTranslations) => {
    if (incomplete_tasks.length == 0) return

    return (
      <View style={{ margin: 6, padding: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>{assessmentFormTranslations.tasks_arising}:</Text>
        {incomplete_tasks.map((task, index) => (
          <View key={index} style={styles.taskContainer}>
            <Text style={styles.taskName}>{`${index + 1}. ${task.name}`}</Text>
            <TouchableWithoutFeedback onPress={() => this.deleteTask(task)}>
              <Icon color="#009999" name="delete" size={25} />
            </TouchableWithoutFeedback>
          </View>
        ))}
      </View>
    )
  }

  renderButtonDone = (assessmentFormTranslations) => {
    const { assessmentDomains } = this.state
    const isDisabled = assessmentDomains.reduce((result, ad) => result || this.isRequireTask(ad), false)

    return (
      <View style={{ marginTop: 10 }}>
        <Button
          raised
          backgroundColor={isDisabled ? '#d5d5d5' : '#009999'}
          icon={{ name: 'save' }}
          title={assessmentFormTranslations.save}
          onPress={() => (isDisabled ? {} : this.saveAssessment())}
        />
      </View>
    )
  }

  renderButtonAddTask = (assessmentDomain, assessmentFormTranslations) => (
    <View style={{ marginBottom: 15, marginTop: 5 }}>
      <Button
        raised
        onPress={() => this.openTaskModal(assessmentDomain.domain)}
        backgroundColor="#000"
        icon={{ name: 'add-circle' }}
        title={assessmentFormTranslations.add_task}
      />
      {this.isRequireTask(assessmentDomain) && !assessmentDomain.required_task_last && (
        <Text style={styles.taskTitle}>{assessmentFormTranslations.at_least_one_task_required}</Text>
      )}
    </View>
  )

  renderAttachment = (assessmentDomain, attachmentTranslations) => {
    if (assessmentDomain.attachments.length == 0) return

    return (
      <View style={{ margin: 6, paddingLeft: 20, paddingRight: 20 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{attachmentTranslations} :</Text>
        {assessmentDomain.attachments.map((attachment, index) => (
          <View key={index} style={styles.attachmentWrapper}>
            <Image style={{ width: 40, height: 40 }} source={{ uri: attachment.uri }} />
            <Text style={styles.listAttachments} numberOfLines={1}>
              {index + 1}
              {'. '}
              {attachment.name || attachment.url.split('/').pop()}
            </Text>
            {attachment.size && (
              <TouchableWithoutFeedback onPress={() => this.removeAttactment(assessmentDomain, index)}>
                <View style={styles.deleteAttactmentWrapper}>
                  <Icon color="#009999" name="delete" size={25} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        ))}
      </View>
    )
  }

  renderTasksPage = () => {
    const { translations } = this.props
    const assessmentFormTranslations = translations.assessments.form
    const { assessmentDomains, incompletedDomainIds } = this.state
    const incompletedAssessmentDomains = assessmentDomains.filter(ad => incompletedDomainIds.includes(ad.domain_id))

    return (
      <ScrollView keyboardDismissMode="on-drag" key="task" showsVerticalScrollIndicator={false}>
        {incompletedAssessmentDomains.length === 0 && (
          <View style={styles.finishedAssessment}>
            <Text style={styles.label}>{assessmentFormTranslations.finished_assessment_msg}</Text>
          </View>
        )}
        {incompletedAssessmentDomains.map(ad => (
          <View style={styles.domainDetailContainer} key={ad.id}>
            <View style={{ padding: 10 }}>
              <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
                Domain {ad.domain.name}
                {' : '}
                {ad.domain.identity}
              </Text>
              {this.renderButtonAddTask(ad, assessmentFormTranslations)}
              <View>{this.renderIncompletedTask(ad, assessmentFormTranslations)}</View>
            </View>
          </View>
        ))}
      </ScrollView>
    )
  }

  renderAssessmentDomain = ad => {
    const { client, translations } = this.props
    const assessmentFormTranslations = translations.assessments.form
    const attachmentTranslations = translations.assessments.attachment
    const domainDescription = ad.domain.description.replace(/<[^>]+>/gi, '').split('&nbsp;')[0]
    const primaryScore = ad.score != null && this.getScoreInfo(ad).colorCode == 'primary'
    return (
      <ScrollView key={ad.id} keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
        <View style={styles.domainDetailContainer}>
          <View style={styles.domainNameContainer}>
            <Text style={styles.username}>{client.given_name + ' ' + client.family_name} </Text>
            <Text style={styles.domainName}>Domain {ad.domain.name}</Text>
          </View>

          <TouchableOpacity onPress={() => this.openDomainDescriptionModal(ad.domain)}>
            <View style={styles.domainDescriptionContainer}>
              <HTMLView value={domainDescription} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20 }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.label, { color: 'red' }]}>* </Text>
            <Text style={styles.label}>{assessmentFormTranslations.reason}</Text>
          </View>
          <TextInput
            autoCapitalize="sentences"
            placeholder={assessmentFormTranslations.reason}
            placeholderTextColor="#ccc"
            returnKeyType="done"
            style={{ flex: 1, borderBottomColor: '#009999', borderBottomWidth: 1, height: 100 }}
            value={ad.reason}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            onChangeText={text => {
              this.setAssessmentDomainField(ad, 'reason', text)
            }}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={styles.label}>
            {assessmentFormTranslations.description}
          </Text>
          {this.renderButtonScore(ad)}
        </View>

        <View style={{ padding: 20 }}>
          <View style={{flexDirection: 'row'}}>
            {ad.goal_required && <Text style={[styles.label, { color: 'red' }]}>* </Text>}
            <Text style={styles.label}>{assessmentFormTranslations.goal}: </Text>
          </View>
          {primaryScore && (
            <View style={{ paddingTop: 10 }}>
              <Text style={{ marginBottom: 10 }}>{assessmentFormTranslations.set_goal}</Text>
              <View style={{ flexDirection: 'row' }}>
                <CheckBox
                  title={i18n.t('language.yes')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent', marginRight: 10 }}
                  checked={ad.goal_required}
                  onPress={() => this.setAssessmentDomainField(ad, 'goal_required', true)}
                />
                <CheckBox
                  title={i18n.t('language.no')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={!ad.goal_required}
                  onPress={() => this.setAssessmentDomainField(ad, 'goal_required', false)}
                />
              </View>
            </View>
          )}
          {primaryScore && !ad.goal_required ? null :
            <TextInput
              autoCapitalize="sentences"
              placeholder={assessmentFormTranslations.goal}
              placeholderTextColor="#ccc"
              returnKeyType="done"
              style={{ flex: 1, borderBottomColor: '#009999', borderBottomWidth: 1, height: 100 }}
              value={ad.goal}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              onChangeText={text => {
                this.setAssessmentDomainField(ad, 'goal', text)
              }}
            />
          }
        </View>
        {this.props.action === 'create' && (
          <View style={{ padding: 20 }}>
          <Text style={{ marginBottom: 10 }}>{assessmentFormTranslations.add_task_confirm}</Text>
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                title={i18n.t('client.form.yes')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#009999"
                style={{ backgroundColor: 'transparent', marginRight: 10 }}
                checked={ad.required_task_last}
                onPress={() => this.setRequireTaskLast(ad, true)}
              />
              <CheckBox
                title={i18n.t('client.form.no')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#009999"
                style={{ backgroundColor: 'transparent' }}
                checked={!ad.required_task_last}
                onPress={() => this.setRequireTaskLast(ad, false)}
              />
            </View>
          </View>
        )}

        <View style={{ paddingBottom: 50 }}>
          <View style={{ marginBottom: 5 }}>
            <Button
              raised
              backgroundColor="#000"
              icon={{ name: 'cloud-upload' }}
              title={i18n.t('button.upload')}
              onPress={() => this.uploadAttachment(ad)}
            />
          </View>
          {!ad.required_task_last && this.renderButtonAddTask(ad, assessmentFormTranslations)}
          {this.renderAttachment(ad, attachmentTranslations.attachments)}
          <View>{this.renderIncompletedTask(ad, assessmentFormTranslations)}</View>
        </View>
      </ScrollView>
    )
  }

  render() {
    const { assessmentDomains } = this.state
    let assessmentPages = assessmentDomains.map(this.renderAssessmentDomain)
    if (this.props.action == 'create')
      assessmentPages = [...assessmentPages, this.renderTasksPage()]

    return (
      <KeyboardAvoidingView style={styles.mainContainer}>
        <Swiper
          ref={swiper => {
            this._swiper = swiper
          }}
          showsButtons={true}
          loop={false}
          containerStyle={styles.container}
          onMomentumScrollEnd={this.handleValidation}
        >
          {assessmentPages}
        </Swiper>
      </KeyboardAvoidingView>
    )
  }
}

const mapState = state => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return { translations }
}


const mapDispatch = {
  createTask,
  deleteTask,
  createAssessment,
  updateAssessment
}

export default connect(
  mapState,
  mapDispatch
)(AssessmentForm)
