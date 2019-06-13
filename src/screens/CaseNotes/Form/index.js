import React, { Component }                     from 'react'
import { connect }                              from 'react-redux'
import { Navigation }                           from 'react-native-navigation'
import { MAIN_COLOR }                           from '../../../constants/colors'
import { groupBy, map, debounce }               from 'lodash'
import { saveCaseNote }                         from '../../../redux/actions/caseNotes'
import { Button, CheckBox }                     from 'react-native-elements'
import { createTask, deleteTask }               from '../../../redux/actions/tasks'
import _                                        from 'lodash'
import i18n                                     from '../../../i18n'
import Icon                                     from 'react-native-vector-icons/MaterialIcons'
import styles                                   from './styles'
import DatePicker                               from 'react-native-datepicker'
import ImagePicker                              from 'react-native-image-picker'
import Collapsible                              from 'react-native-collapsible'
import SectionedMultiSelect                     from 'react-native-sectioned-multi-select'
import { DocumentPicker, DocumentPickerUtil }   from 'react-native-document-picker'
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity
} from 'react-native'

const MAX_UPLOAD_SIZE = 30000

class CaseNoteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      meetingDate: '',
      attendee: '',
      interactionType: 'default_type',
      caseNoteDomainGroups: [],
      attachmentsSize: 0,
      arisingTasks: [],
      onGoingTasks: [],
      collapsibles: {}
    }

    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed = () => {
    const { caseNote = {}, client, action, previousComponentId,custom } = this.props
    const { attendee, meetingDate, interactionType, caseNoteDomainGroups } = this.state

    if (!meetingDate) {
      Alert.alert(
        i18n.t('client.case_note_form.validation_title'),
        i18n.t('client.case_note_form.validation_meeting_date')
      )

      this.scrollView.scrollTo({ x: 0, animated: true })
      return
    }

    if (!attendee) {
      Alert.alert(
        i18n.t('client.case_note_form.validation_title'),
        i18n.t('client.case_note_form.validation_attendee')
      )

      this.scrollView.scrollTo({ x: 0, animated: true })
      this.attendeeInput.focus()
      return
    }

    if (interactionType === 'default_type') {
      Alert.alert(
        i18n.t('client.case_note_form.validation_title'),
        i18n.t('client.case_note_form.validation_type')
      )

      this.scrollView.scrollTo({ x: 0, animated: true })
      return
    }

    const params = {
      id: caseNote.id,
      clientId: client.id,
      custom,
      attendee,
      meetingDate,
      interactionType,
      caseNoteDomainGroups
    }

    this.props.saveCaseNote(params, client, action, previousComponentId, this.props.onSaveSuccess)
  }

  componentDidMount() {
    const { domains, action, custom, caseNote, client } = this.props
    const tasks = [...client.tasks.overdue, ...client.tasks.today, ...client.tasks.upcoming]
    let caseNoteDomainGroups = []
    let caseNoteDomainIds = {}
    if (action === 'update') {
      caseNoteDomainGroups = caseNote.case_note_domain_group.map(cndg => ({
        ...cndg,
        task_ids: [],
        domains: domains.filter(d => d.domain_group_id === cndg.domain_group_id)
      }))
      this.setState({
        id: caseNote.id,
        meetingDate: caseNote.meeting_date,
        attendee: caseNote.attendee,
        interactionType: caseNote.interaction_type,
        onGoingTasks: tasks,
        caseNoteDomainGroups
      })
    } else {
      const availableDomains = domains.filter(domain => domain.custom_domain == custom)
      const domainGroups = availableDomains.length > 0 ? groupBy(availableDomains, 'domain_group_id') : {}
      caseNoteDomainGroups = map(domainGroups, (domains, domainGroupId) => {
        const domainGroupIdentity = map(domains, 'identity').join(', ')

        return {
          note: '',
          domain_group_id: domainGroupId,
          task_ids: [],
          attachments: [],
          domains: domains,
          domain_group_identities: domainGroupIdentity,
        }
      })
      this.setState({ caseNoteDomainGroups, onGoingTasks: tasks })
    }
    caseNoteDomainGroups.forEach((caseNoteDomainGroup, index) => {
      const collapsed = index != 0
      caseNoteDomainIds = {...caseNoteDomainIds, [caseNoteDomainGroup.domain_group_id]: collapsed}
    })
    this.setState({collapsibles: caseNoteDomainIds})
  }

  uploadAttachment = caseNote => {
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
        this.selectAllFile(caseNote)
      } else if (response.didCancel) {
      } else {
        this.handleSelectedFile(response, caseNote)
      }
    })
  }

  selectAllFile = caseNote => {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (error === null && res.uri != null) {
          const type = res.fileName.substring(res.fileName.lastIndexOf('.') + 1)
          if ('jpg jpeg png doc docx xls xlsx pdf'.includes(type)) {
            this.handleSelectedFile(res, caseNote)
          } else {
            Alert.alert('Invalid file type', 'Allow only : jpg jpeg png doc docx xls xlsx pdf')
          }
        }
      }
    )
  }

  handleSelectedFile = (response, caseNote) => {
    let { caseNoteDomainGroups, attachmentsSize } = this.state
    const fileSize    = response.fileSize / 1024
    attachmentsSize  += fileSize

    if (attachmentsSize > MAX_UPLOAD_SIZE) {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    } else {
      const filePath = response.path != undefined ? `file://${response.path}` : response.uri

      const source   = {
        uri: response.uri,
        path: filePath,
        name: response.fileName,
        type: response.type,
        size: fileSize
      }

      caseNoteDomainGroups = caseNoteDomainGroups.map(element => {
        return element.domain_group_id === caseNote.domain_group_id ? { ...element, attachments: element.attachments.concat(source) } : element
      })

      this.setState({ attachmentsSize, caseNoteDomainGroups })
    }
  }

  removeAttactment = (caseNote, index) => {
    let { caseNoteDomainGroups } = this.state
    let attachments = caseNote.attachments
    attachments     = attachments.filter((attachment, attIndex) => attIndex !== index )

    caseNoteDomainGroups = caseNoteDomainGroups.map(ad => {
      return ad.domain_group_id === caseNote.domain_group_id ?
        { ...ad, attachments } : ad
    })

    this.setState({ caseNoteDomainGroups })
  }

  openTaskModal = debounce((domainGroupId, taskTranslations) => {
    const { client, domains, custom } = this.props
    Navigation.showModal({
      component: {
        name: 'oscar.taskForm',
        passProps: {
          formTranslations: taskTranslations,
          domains: domains.filter(domain => domain.domain_group_id === parseInt(domainGroupId) && domain.custom_domain === custom),
          onCreateTask: (params) => this.props.createTask(params, client.id, (task) => this.handleTaskUpdate(task, 'create'))
        },
      }
    })
  }, 1000, { maxWait: 1000, leading: true, trailing: false })

  deleteTask = task => {
    const { client } = this.props
    this.props.deleteTask(task, client.id, (task) => this.handleTaskUpdate(task, 'delete'))
  }

  handleTaskUpdate = (task, action) => {
    let { arisingTasks } = this.state

    if (action === 'create')
      arisingTasks = arisingTasks.concat(task)

    if (action === 'delete')
      arisingTasks = arisingTasks.filter(t => t.id !== task.id)

    this.setState({ arisingTasks })
  }

  handleTaskCheck = (caseNote, taskId) => {
    let { caseNoteDomainGroups } = this.state
    caseNoteDomainGroups = caseNoteDomainGroups.map(cndg => {
      if (cndg.domain_group_id === caseNote.domain_group_id) {
        let task_ids = cndg.task_ids
        if (task_ids.includes(taskId))
          task_ids = task_ids.filter(tId => tId != taskId)
        else
          task_ids = task_ids.concat(taskId)

        cndg = { ...cndg, task_ids }
      }

      return cndg
    })

    this.setState({ caseNoteDomainGroups })
  }

  updateNote = (caseNote, note) => {
    let { caseNoteDomainGroups } = this.state

    caseNoteDomainGroups = caseNoteDomainGroups.map((cndg) => {
      if (cndg.domain_group_id === caseNote.domain_group_id)
        cndg = { ...cndg, note }
      return cndg
    })

    this.setState({ caseNoteDomainGroups })
  }

  interactionTypes = () => {
    return [
      { id: 'Visit', name: 'Visit' },
      { id: 'Non face to face', name: 'Non face to face' },
      { id: '3rd Party', name: '3rd Party' },
      { id: 'Other', name: 'Other' },
    ]
  }

  toggleExpanded(domainGroupId, collapsed) {
    const { collapsibles } = this.state
    this.setState({collapsibles: {...collapsibles, [domainGroupId]: !collapsed}})
  }

  renderDomainGroup = (caseNote, index, translations) => {
    const { collapsibles } = this.state
    const domainGroupId = caseNote.domain_group_id
    const collapsed = collapsibles[domainGroupId]
    const caseNoteTranslations = translations.case_notes
    const formTranslations = caseNoteTranslations.form
    const attachmentTranslation = caseNoteTranslations.attachment_fields
    const taskTranslations = translations.client.tasks.form
    return (
      <DomainGroupCard key={index} title={caseNote.domain_group_identities} toggleExpanded={() => this.toggleExpanded(domainGroupId, collapsed)} collapsed={collapsed}>
        <TextInput
          autoCapitalize="sentences"
          placeholder={i18n.t('client.case_note_form.enter_text')}
          placeholderTextColor="#ccc"
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          style={styles.textarea}
          value={caseNote.note}
          onChangeText={note => this.updateNote(caseNote, note)}
        />
        {
          caseNote.attachments.length > 0 &&
            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>{attachmentTranslation.attachments}:</Text>
              {
                caseNote.attachments.map((attachment, index) => {
                  const name = (attachment.name || attachment.url.split('/').pop()).substring(0, 20)

                  return (
                    <View style={styles.attachmentWrapper} key={index}>
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: attachment.uri }}
                      />
                      <Text style={styles.listAttachments}>{index + 1}. { name }...</Text>
                      {
                        attachment.size &&
                          <TouchableWithoutFeedback
                            onPress={() => this.removeAttactment(caseNote, index)}>
                            <View>
                              <Icon color="red" name="delete" size={25} />
                            </View>
                          </TouchableWithoutFeedback>
                      }
                    </View>
                  )
                })
              }
            </View>
        }
        <View style={styles.buttonWrapper}>
          <Button
            raised
            onPress={() => this.uploadAttachment(caseNote)}
            backgroundColor="#000"
            icon={{ name: 'cloud-upload' }}
            title={i18n.t('button.upload')}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            raised
            onPress={() => this.openTaskModal(caseNote.domain_group_id, taskTranslations)}
            backgroundColor="#088"
            icon={{ name: 'add-circle' }}
            title={formTranslations.add_task}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          {
            caseNote.domains.map((domain, index) => {
              const tasks = this.state.onGoingTasks.filter(task => task.domain.id === domain.id)

              if (tasks.length === 0)
                return

              return (
                <Card key={index} title={`${formTranslations.domain} ${domain.name}`} style={{ marginLeft: 0, marginRight: 0 }}>
                  <Text style={styles.label}>
                    {formTranslations.on_going_tasks}
                  </Text>
                  {
                    tasks.map(task => (
                      <CheckBox
                        key={task.id}
                        title={task.name}
                        checked={caseNote.task_ids.includes(task.id)}
                        iconType="material"
                        checkedIcon="check-box"
                        uncheckedIcon="check-box-outline-blank"
                        checkedColor="#009999"
                        uncheckedColor="#009999"
                        textStyle={styles.checkBox}
                        containerStyle={styles.checkBoxWrapper}
                        onPress={() => this.handleTaskCheck(caseNote, task.id)}
                      />
                    ))
                  }
                </Card>
              )
            })
          }
        </View>
        {
          this.state.arisingTasks.length > 0 &&
            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>{formTranslations.tasks_arising}:</Text>
              {
                this.state.arisingTasks.map((task, index) => (
                  <View key={index} style={styles.attachmentWrapper}>
                    <Text style={styles.listAttachments}>
                      {index + 1}. {task.name}
                    </Text>
                    <TouchableWithoutFeedback onPress={() => this.deleteTask(task)}>
                      <Icon color="red" name="delete" size={25}/>
                    </TouchableWithoutFeedback>
                  </View>
                ))
              }
            </View>
        }
      </DomainGroupCard>
    )
  }

  render() {
    const { translations } = this.props
    const formTranslations = translations.case_notes.form
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView showsVerticalScrollIndicator={false} ref={ref => this.scrollView = ref}>
          <Card title={formTranslations.meeting_detail}>
            <View style={styles.inputWrapper}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{formTranslations.on_date}</Text>
              </View>
              <DatePicker
                style={styles.datePicker}
                date={this.state.meetingDate}
                mode="date"
                placeholder={i18n.t('client.select_date')}
                placeholderText="#ccc"
                showIcon={true}
                format="YYYY-MM-DD"
                minDate="2000-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={meetingDate => this.setState({  meetingDate })}
                customStyles={{ dateInput: styles.datePickerBorder }}
                iconComponent={
                  <View style={styles.datePickerIcon}>
                    <Icon name="date-range" size={30} />
                  </View>
                }
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{formTranslations.present}</Text>
              </View>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.case_note_form.enter_text')}
                underlineColorAndroid="#c7cdd3"
                value={this.state.attendee}
                onChangeText={attendee => this.setState({ attendee })}
                style={{ height: 40 }}
                ref={ref => this.attendeeInput = ref}
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color:'red'}]}>* </Text>
                <Text style={styles.label}>{formTranslations.type}</Text>
              </View>
              <SectionedMultiSelect
                items={this.interactionTypes()}
                uniqueKey="id"
                modalWithSafeAreaView
                selectText={i18n.t('select_option')}
                hideSearch={true}
                confirmText={i18n.t('confirm')}
                showDropDowns={true}
                single={true}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR },
                  cancelButton: { width: 150 },
                  chipText: { maxWidth: 280 },
                  selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
                }}
                onSelectedItemsChange={ interactionTypes => this.setState({ interactionType: interactionTypes[0] }) }
                selectedItems={[this.state.interactionType]}
              />
            </View>
          </Card>
          {
            this.state.caseNoteDomainGroups.map((caseNoteDomainGroup, index) => {
              return this.renderDomainGroup(caseNoteDomainGroup, index, translations)
            })
          }
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const DomainGroupCard = props => {
  const iconName = props.collapsed ? 'arrow-drop-down' :  'arrow-drop-up'
  return (
    <View style={[styles.card, props.style]}>
      <View style={[styles.header, {flexDirection: 'row', justifyContent: 'space-between'}]}>
        <View style={{width: '95%'}}>
          <Text style={styles.headerTitle}>
            { props.title }
          </Text>
        </View>
        <TouchableOpacity onPress={props.toggleExpanded}>
          <Icon name={iconName} size={30} style={{marginRight: 5, color: '#ffffff'}}/>
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={props.collapsed}>
        <View style={styles.content}>
          { props.children }
        </View>
      </Collapsible>
    </View>
  )
}

const Card = props => (
  <View style={[styles.card, props.style]}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        { props.title }
      </Text>
    </View>
    <View style={styles.content}>
      { props.children }
    </View>
  </View>
)

const mapState = state => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return {
    domains: state.domains.data,
    translations
  }
}

const mapDispatch = {
  createTask,
  deleteTask,
  saveCaseNote
}

export default connect(mapState, mapDispatch)(CaseNoteForm)
