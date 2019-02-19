import React, { Component } from 'react'
import HTMLView from 'react-native-htmlview'
import { Button, Divider, CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'
import { Navigation } from 'react-native-navigation'
import * as AssessmentHelper from '../helpers'
import i18n from '../../../i18n'
import { SCORE_COLOR } from '../../../constants/colors'

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

class AssessmentForm extends Component {
  state = {
    id: Date.now(),
    attachmentsSize: 0,
    assessmentDomains: [],
    incompletedDomainIds: [],
  }

  componentWillMount() {
    const { domains, client, assessment, custom_domain } = this.props
    const assessmentDomains = AssessmentHelper.populateAssessmentDomains(assessment, domains, client)
    this.setState({ assessmentDomains })
  }

  componentDidMount() {
    if (this.props.action !== 'update') return

    const { assessment }       = this.props
    const attachmentsSize      = AssessmentHelper.calculateAttachmentsSize(assessment)
    const incompletedDomainIds = AssessmentHelper.incompletedDomainIds(assessment)

    this.setState({ incompletedDomainIds, attachmentsSize })
  }

  setAssessmentDomainField = (assessmentDomain, key, value) => {
    let { assessmentDomains } = this.state

    assessmentDomains = assessmentDomains.map((ad) => {
      if (ad.domain_id === assessmentDomain.domain_id)
        ad = { ...ad, [key]: value }
      return ad
    })

    this.setState({ assessmentDomains })
  }

  setRequireTaskLast(assessmentDomain, addInLastStep) {
    let { incompletedDomainIds } = this.state
    if (addInLastStep)
      incompletedDomainIds.push(assessmentDomain.domain_id)
    else
      incompletedDomainIds = incompletedDomainIds.filter(id => id != assessmentDomain.domain_id)

    this.setAssessmentDomainField(assessmentDomain, 'required_task_last', addInLastStep)
    this.setState({ incompletedDomainIds })
  }

 removeAttactment(assessmentDomain, index) {
    let { assessmentDomains } = this.state
    let attachments = assessmentDomain.attachments
    attachments     = attachments.filter((attachment, attIndex) => attIndex !== index )

    assessmentDomains = assessmentDomains.map(ad => {
      return ad.domain_id === assessmentDomain.domain_id ?
        { ...ad, attachments } : ad
    })

    this.setState({ assessmentDomains })
  }

  _openTaskModal(domain) {
    const { client } = this.props
    const self = this
    this.props.navigator.showModal({
      screen: 'cif.assessmentTaskModal',
      passProps: {
        onCreateNewTask: self.oncreateTaskSuccess,
        domain: domain.id,
        client: client
      },
      navigatorStyle: { navBarHidden: true }
    })
  }

  oncreateTaskSuccess(task) {
    this.handleTaskUpdate(task, 'create')
    this.props.navigator.dismissModal({})
  }

  deleteTask(task) {
    // const { client } = this.props
    // this.props.deleteTask(task, client, this)
  }

  ondeleteTaskSuccess(task) {
    this.handleTaskUpdate(task, 'delete')
  }

  handleTaskUpdate(task, type) {
    let { client, assessments } = this.state
    const isUpcoming = moment(task.completion_date).isAfter(Date.now(), 'day')
    const isToday    = moment(task.completion_date).isSame(Date.now(), 'day')

    assessments = assessments.map(assessment => {
      if (assessment.domain.id === task.domain.id)
        assessment.incomplete_tasks = this._updateTask(assessment.incomplete_tasks, task, type)

      return assessment
    })

    let tasks = isUpcoming ?
                  client.tasks.upcoming : isToday ?
                  client.tasks.today :
                  client.tasks.overdue

    const taskType = isUpcoming ?
                      'upcoming' : isToday ?
                      'today' :
                      'overdue'

    tasks = this._updateTask(tasks, task, type)

    const updatedTasks  = { ...client.tasks, [taskType]: tasks }
    let   updatedClient = { ...client, tasks: updatedTasks}

    if (this.props.action === 'create') {
      this.setState({ client: updatedClient, assessments })
      this.props.updateStateClient(updatedClient)
    } else {
      const params = {
        id: this.props.assessment.id,
        client_id: client.id,
        created_at: this.props.assessment.created_at,
        assessment_domain: assessments
      }

      const updatedAssessments = _.map(updatedClient.assessments, assessment => {
        if (assessment.id == params.id)
          return params
        return assessment
      })

      updatedClient = { ...updatedClient, assessments: updatedAssessments }

      this.setState({ client: updatedClient, assessments })
      this.props.updateStateAssessment(updatedClient)

      if (!this.props.isHasInternet) {
        this.handleUpdateClientsOffline(updatedClient)
      }
    }
  }

  handleUpdateClientsOffline(clientUpdated) {
    const { clients } = this.props
    const updatedClients = _.map(clients, client => {
      if (client.id == clientUpdated.id) {
        return clientUpdated
      }
      return client
    })

    this.props.updateClientsOffline(updatedClients)
  }


  _updateTask(tasks, task, action) {
    if (action === 'create')
      return tasks.concat(task)

    if (action === 'delete')
      return tasks.filter(t => t.id !== task.id)

    return tasks
  }



  handleValidation = (e, state, context) => {
    if (state.index == 0) return

    const previousIndex         = state.index - 1
    const { assessmentDomains } = this.state
    const assessmentDomain      = assessmentDomains[previousIndex]
    const domainName            = assessmentDomain.domain.name

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
  }

  handleValidationFail = (domainName, field) => {
    const message = field === 'task'
      ? i18n.t('client.assessment_form.warning_tasks', { domainName })
      : i18n.t('client.assessment_form.warning_domain', { title: field, domainName })

    const title = field === 'task'
      ? i18n.t('client.assessment_form.title_task')
      : i18n.t('client.assessment_form.title_domain')

    Alert.alert(title, message)
    this._swiper.scrollBy(-1)
  }

  isRequireGoal = (assessmentDomain) => {
    if (!assessmentDomain.score) return false

    const score = this.getScoreInfo(assessmentDomain)
    return score.colorCode !== 'primary'
  }

  isRequireTask = assessmentDomain => {
    if (!assessmentDomain.score) return false

    const score    = this.getScoreInfo(assessmentDomain)
    const hasTasks = assessmentDomain.incomplete_tasks.length > 0

    return ['danger', 'warning'].includes(score.colorCode) && !hasTasks
  }

  getScoreInfo = assessmentDomain => {
    const { domain, score } = assessmentDomain
    const scoreInfo = domain[`score_${score}`]

    return {
      colorCode:  scoreInfo.color,
      color:      SCORE_COLOR[scoreInfo.color],
      definition: scoreInfo.definition
    }
  }

  openDomainDescriptionModal(domain) {
    Navigation.showModal({
      component: {
        name: 'oscar.domainDescriptionModal',
        passProps: { domain },
      }
    })
  }

  renderButtonScore = assessmentDomain => (
    <View style={styles.buttonContainer}>
      {
        [1, 2, 3, 4].map(score => {
          const newAd     = { ...assessmentDomain, score }
          const scoreInfo = this.getScoreInfo(newAd)
          const label     = scoreInfo.definition ? scoreInfo.definition : score
          const color     = assessmentDomain.score == score ? scoreInfo.color : '#bfbfbf'

          return (
            <TouchableOpacity
              key={score}
              onPress={() => this.setAssessmentDomainField(assessmentDomain, 'score', score)}>
              <View style={[styles.button, { backgroundColor: color }]}>
                <Text style={styles.buttonText}>{ label }</Text>
              </View>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )

renderIncompletedTask = ({ incomplete_tasks }) => {
    if (incomplete_tasks.length == 0) return

    return (
      <View style={{ margin: 6, padding: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>
          { i18n.t('client.assessment_form.task_arising') }:
        </Text>
        {
          incomplete_tasks.map((task, index) => (
            <View key={index} style={styles.taskContainer}>
              <Text style={styles.taskName}>
                { `${ index + 1 }. ${ task.name }` }
              </Text>
              <TouchableWithoutFeedback onPress={() => this.deleteTask(task)}>
                <Icon color="#009999" name="delete" size={25} />
              </TouchableWithoutFeedback>
            </View>
          ))
        }
      </View>
    )
  }

  renderButtonDone = () => {
    const { assessmentDomains } = this.state
    const isDisabled = assessmentDomains.reduce(
      (result, ad) => result || this.isRequireTask(ad),
      false)

    return (
      <View style={{ marginTop: 10 }}>
        <Button
          raised
          backgroundColor={ isDisabled ? "#d5d5d5" : "#009999" }
          icon={{ name: 'save' }}
          buttonStyle={{
            marginBottom: 5,
            marginLeft: 0,
            marginRight: 0
          }}
          title={ i18n.t('button.save') }
          onPress={() => isDisabled ? {} : this._saveAssessments()}
        />
      </View>
    )
  }

  renderButtonAddTask = assessmentDomain => (
    <View>
      <Button
        raised
        buttonStyle={{
          marginBottom: 15,
          marginTop: 5,
          marginLeft: 0,
          marginRight: 0
        }}
        onPress={() => this._openTaskModal(assessmentDomain.domain)}
        backgroundColor="#000"
        icon={{ name: 'add-circle' }}
        title={i18n.t('button.add_task')}
      />
      {
        this.isRequireTask(assessmentDomain) && !assessmentDomain.required_task_last &&
        <Text style={styles.taskTitle}>{i18n.t('client.assessment_form.warning_task')}</Text>
      }
    </View>
  )

  renderAttachment = assessmentDomain => (
    assessmentDomain.attachments.map((attachment, index) => (
      <View key={index} style={styles.attachmentWrapper}>
        <Image
          style={{ width: 40, height: 40 }}
          source={{ uri: attachment.uri }}
        />
        <Text style={styles.listAttachments} numberOfLines={1}>
          { index + 1 }{'. '}{attachment.name || attachment.url.split('/').pop()}
        </Text>
        {
          attachment.size &&
            <TouchableWithoutFeedback
              onPress={() => this.removeAttactment(assessmentDomain, index)}
            >
              <View style={styles.deleteAttactmentWrapper}>
                <Icon color="#888" name="delete" size={25} />
              </View>
            </TouchableWithoutFeedback>
        }
      </View>
    ))
  )

  renderTasksPage = () => {
    const { assessmentDomains, incompletedDomainIds } = this.state
    const incompletedAssessmentDomains = assessmentDomains.filter(ad =>
      incompletedDomainIds.includes(ad.domain_id))

    return (
      <ScrollView keyboardDismissMode="on-drag" key='task' showsVerticalScrollIndicator={false}>
        {
          incompletedAssessmentDomains.length === 0 &&
          <View style={styles.finishedAssessment}>
            <Text style={styles.label}>
              { i18n.t('client.assessment_form.finished_assessment_msg') }
            </Text>
          </View>
        }
        {
          incompletedAssessmentDomains.map(ad => (
            <View style={styles.domainDetailContainer} key={ad.id}>
              <View style={{ padding: 10 }}>
                <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Domain {ad.domain.name}{' : '}{ad.domain.identity}</Text>
                { this.renderButtonAddTask(ad) }
                <View>{ this.renderIncompletedTask(ad) }</View>
              </View>

            </View>
          ))
        }
        <View>
          {this.renderButtonDone()}
        </View>
      </ScrollView>
    )
  }

  renderAssessmentDomain = ad => {
    const { client } = this.props

    return (
      <ScrollView key={ad.id} keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
        <View style={styles.domainDetailContainer}>
          <View style={styles.domainNameContainer}>
            <Text style={styles.username}>
              {client.given_name + ' ' + client.family_name}{' '}
            </Text>
            <Text style={styles.domainName}>
              Domain {ad.domain.name}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => this.openDomainDescriptionModal(ad.domain)}>
            <View style={styles.domainDescriptionContainer}>
              <HTMLView value={ad.domain.description.replace(/<[^>]+>|<p>|\\n/gi, '')} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', padding: 20 }}>
          <Text style={{ color: 'red' }}>* </Text>
          <TextInput
            autoCapitalize="sentences"
            placeholder={i18n.t('client.assessment_form.reason')}
            placeholderTextColor="#ccc"
            returnKeyType="done"
            style={{ flex: 1, borderBottomColor: '#ccc', borderBottomWidth: 1, height: 100 }}
            value={ad.reason}
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={text => {
              this.setAssessmentDomainField(ad, 'reason', text)
            }}
          />
        </View>
        <View style={styles.domainInfoContainer}>
          <Text style={styles.domainInfo}>Choose which of the following description most closely describes the client's situation, base on your observations.</Text>
          {this.renderButtonScore(ad)}
        </View>

        <View style={{ flexDirection: 'row', padding: 20 }}>
          {
            !!ad.score &&
            this.isRequireGoal(ad) &&
            <Text style={{ color: 'red' }}>* </Text>
          }
          <TextInput
            autoCapitalize="sentences"
            placeholder={i18n.t('client.assessment_form.goal')}
            placeholderTextColor="#ccc"
            returnKeyType="done"
            style={{ flex: 1, borderBottomColor: '#ccc', borderBottomWidth: 1, height: 100 }}
            value={ad.goal}
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={text => {
              this.setAssessmentDomainField(ad, 'goal', text)
            }}
          />
        </View>
        {
          this.props.action === 'create' &&
            <View style={{ padding: 20 }}>
              <Text style={{ marginBottom: 10 }}>
                {i18n.t('client.assessment_form.required_task_last')}
              </Text>
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
        }

        <View>
          { this.renderAttachment(ad) }
          <Button
            raised
            backgroundColor="#000"
            icon={{ name: 'cloud-upload' }}
            buttonStyle={{
              marginTop: 15,
              marginBottom: 5,
              marginLeft: 0,
              marginRight: 0
            }}
            title={i18n.t('button.upload')}
            onPress={() => this._uploader(ad)}
          />
          { !ad.required_task_last && this.renderButtonAddTask(ad) }
          <View>{ this.renderIncompletedTask(ad) }</View>
        </View>
      </ScrollView>
    )
  }

  render() {
    const { assessmentDomains } = this.state
    let assessmentPages = assessmentDomains.map(this.renderAssessmentDomain)
    assessmentPages     = [...assessmentPages, this.renderTasksPage()]

    return (
      <KeyboardAvoidingView style={styles.mainContainer}>
        <Swiper
          ref={swiper => { this._swiper = swiper }}
          loop={false}
          style={styles.container}
          onMomentumScrollEnd={this._handleValidation}
        >
          { assessmentPages }
        </Swiper>
      </KeyboardAvoidingView>
    )
  }
}

export default AssessmentForm