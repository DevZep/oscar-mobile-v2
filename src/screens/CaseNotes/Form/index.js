import React, { Component }                     from 'react'
import { connect }                              from 'react-redux'
import { Navigation }                           from 'react-native-navigation'
import { MAIN_COLOR }                           from '../../../constants/colors'
import { groupBy, map, debounce }               from 'lodash'
import { saveCaseNote }                         from '../../../redux/actions/caseNotes'
import { Button }                               from 'react-native-elements'
import { createTask, deleteTask }               from '../../../redux/actions/tasks'
import _                                        from 'lodash'
import i18n                                     from '../../../i18n'
import Icon                                     from 'react-native-vector-icons/MaterialIcons'
import styles                                   from './styles'
import DatePicker                               from 'react-native-datepicker'
import ImagePicker                              from 'react-native-image-picker'
import SectionedMultiSelect                     from 'react-native-sectioned-multi-select'
import { DocumentPicker, DocumentPickerUtil }   from 'react-native-document-picker'
import { MAX_SIZE, options }                    from '../../../constants/option'
import {
  View,
  Text,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'

import Card             from './_card'
import DomainGroups     from './_domainGroup'
import ListAttachments  from './_attachments'

class CaseNoteForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      note: '',
      attendee: '',
      attachments: [],
      meetingDate: '',
      arisingTasks: [],
      onGoingTasks: [],
      domainGroups: {},
      collapsibles: {},
      interactionType: 'default_type',
      attachmentsSize: 0,
      domainGroupsTypes: [],
      onCompletedTasksIDs: [],
      caseNoteDomainGroups: [],
      selectedDomainGroups: [],
    }

    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed = () => {
    const { caseNote = {}, client, action, previousComponentId,custom } = this.props
    const { attendee, meetingDate, interactionType, caseNoteDomainGroups, note, selectedDomainGroups, attachments, onCompletedTasksIDs } = this.state

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

    if (selectedDomainGroups.length == 0 ) {
      Alert.alert(
        i18n.t('client.case_note_form.validation_title'),
        i18n.t('client.case_note_form.validation_domain_type')
      )

      this.scrollView.scrollTo({ x: 0, animated: true })
      return
    }

    const params = {
      id: caseNote.id,
      clientId: client.id,
      note,
      custom,
      attendee,
      attachments,
      meetingDate,
      interactionType,
      onCompletedTasksIDs,
      selectedDomainGroups,
      caseNoteDomainGroups,
    }

    this.props.saveCaseNote(params, client, action, previousComponentId, this.props.onSaveSuccess)
  }

  componentDidMount() {
    const { 
      client,
      action, 
      custom, 
      domains, 
      caseNote, 
    }                         = this.props
    const tasks               = [...client.tasks.overdue, ...client.tasks.today, ...client.tasks.upcoming]
    const availableDomains    = domains.filter(domain => domain.custom_domain == custom)
    const domainGroups        = availableDomains.length > 0 ? groupBy(availableDomains, 'domain_group_id') : {}

    let caseNoteDomainGroups  = []
    let caseNoteDomainIds     = {}

    if (action === 'update') {
      caseNoteDomainGroups = caseNote.case_note_domain_group.map(cndg => ({
        ...cndg,
        task_ids: [],
        domains: domains.filter(d => d.domain_group_id === cndg.domain_group_id)
      }))

      let notes = caseNote.case_note_domain_group.
                  filter(cndg => !!cndg.note).
                  map(case_note => case_note.note)

      let selectedDomainGroups =
        _.compact(
          _.map(caseNote.case_note_domain_group, cndg =>
            _.includes(caseNote.selected_domain_group_ids, cndg.domain_group_id.toString())
              ? cndg.domain_group_id 
              : ''
          )
        )

      let cndg_completed_task_ids = 
        _.map(
          _.flatten(
            _.map(
              caseNote.case_note_domain_group, 
              (cndg, index) => cndg.completed_tasks
            )
          ),

          complete_task => complete_task.id
        )

      let onGoingTasks = 
        _.filter(tasks, (task) => 
          !_.includes(cndg_completed_task_ids, task.id)
        )
      

      this.setState({
        id: caseNote.id,
        note: _.uniq(notes).join(' '), 
        meetingDate: caseNote.meeting_date,
        attendee: caseNote.attendee,
        interactionType: caseNote.interaction_type,
        onGoingTasks: onGoingTasks,
        caseNoteDomainGroups,
        selectedDomainGroups
      })
    } else {
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

    domainGroupsTypes = map(domainGroups, (domains, domainGroupId) => {
      const domainGroupIdentity = map(domains, 'identity').join(', ')

      return {
        id: parseInt(domainGroupId),
        name: `Domain ${domainGroupId} (${domainGroupIdentity})`,
      }
    })

    console.log("domainGroupsTypes ", domainGroupsTypes)

    this.setState({collapsibles: caseNoteDomainIds, domainGroupsTypes, domainGroups})
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps -> ', nextProps, this.props);
  }

  uploadAttachment = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        alert('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        this.selectAllFile()
      } else if (response.didCancel) {
      } else {
        this.handleSelectedFile(response)
      }
    })
  }

  selectAllFile = () => {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (error === null && res.uri != null) {
          const type = res.fileName.substring(res.fileName.lastIndexOf('.') + 1)
          if ('jpg jpeg png doc docx xls xlsx pdf'.includes(type)) {
            this.handleSelectedFile(res)
          } else {
            Alert.alert('Invalid file type', 'Allow only : jpg jpeg png doc docx xls xlsx pdf')
          }
        }
      }
    )
  }

  handleSelectedFile = (response) => {
    let { attachmentsSize, attachments, selectedDomainGroups, caseNoteDomainGroups } = this.state
    const filePath = response.path != undefined ? `file://${response.path}` : response.uri
    const fileSize = response.fileSize / 1024
    const source = {
      uri: response.uri,
      path: filePath,
      name: response.fileName,
      type: response.type,
      size: fileSize
    }

    attachmentsSize += fileSize
    attachments = attachments.concat(source)

    if (attachmentsSize > MAX_SIZE) {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    } else {
      caseNoteDomainGroups = caseNoteDomainGroups.map(element => {
        return _.includes(selectedDomainGroups, parseInt(element.domain_group_id)) ? { ...element, attachments } : element
      })
      
      this.setState({ attachmentsSize, attachments, caseNoteDomainGroups })
    }
  }

  removeAttactment = (index) => {
    let { caseNoteDomainGroups, attachments, selectedDomainGroups } = this.state
    attachments = attachments.splice(index, 1)

    caseNoteDomainGroups = caseNoteDomainGroups.map(cndg => {
      return _.includes(selectedDomainGroups, parseInt(cndg.domain_group_id)) ? { ...cndg, attachments } : cndg
    })

    this.setState({ caseNoteDomainGroups })
  }

  openTaskModal = debounce(domainGroupIds => {
    console.log("domainGroupIds", domainGroupIds)
    const { client, domains, custom } = this.props
    Navigation.showModal({
      component: {
        name: 'oscar.taskForm',
        passProps: {
          domains: domains.filter(domain => _.includes(domainGroupIds, parseInt(domain.domain_group_id)) && domain.custom_domain === custom),
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
    let { caseNoteDomainGroups, onCompletedTasksIDs  } = this.state
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


    this.setState({ 
      caseNoteDomainGroups, 
      onCompletedTasksIDs: onCompletedTasksIDs.concat(taskId)
     })
  }

  updateNote = (note) => {
    let {caseNoteDomainGroups, selectedDomainGroups} = this.state

    cndgs = caseNoteDomainGroups.map((cndg) => {
      if (_.includes(selectedDomainGroups, parseInt(cndg.domain_group_id)))
        cndg = { ...cndg, note }
      else 
        cndg = { ...cndg, note: "" }
      return cndg
    })

    this.setState({ caseNoteDomainGroups: cndgs, note })
  }

  interactionTypes = () => {
    return [
      { id: 'Visit', name: 'Visit' },
      { id: 'Non face to face', name: 'Non face to face' },
      { id: '3rd Party', name: '3rd Party' },
      { id: 'Other', name: 'Other' },
    ]
  }

  toggleExpanded = (domainGroupId, collapsed) => {
    const { collapsibles } = this.state
    this.setState({collapsibles: {...collapsibles, [domainGroupId]: !collapsed}})
  }

  handleChangeDomainGroups = (selectedItems) => {
    let {caseNoteDomainGroups, note, attachments, domainGroups} = this.state

    // useful when we made the change to note and then add more domain groups
    cndgs = caseNoteDomainGroups.map((cndg) => {
      if (_.includes(selectedItems, parseInt(cndg.domain_group_id)))
        cndg = { ...cndg, note, attachments }
      else 
        cndg = { ...cndg, note: "", attachments }
      return cndg
    })

    this.setState({ selectedDomainGroups: selectedItems, caseNoteDomainGroups: cndgs })
  };

  render() {
    const {selectedDomainGroups, domainGroupsTypes} = this.state

    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView showsVerticalScrollIndicator={false} ref={ref => this.scrollView = ref}>
          <Card title={i18n.t('client.case_note_form.meeting_detail')}>
            <View style={styles.inputWrapper}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.case_note_form.on_date')}</Text>
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
                <Text style={styles.label}>{i18n.t('client.case_note_form.who_was_there')}</Text>
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
                <Text style={styles.label}>{i18n.t('client.case_note_form.type')}</Text>
                <Text style={{fontStyle: 'italic'}}> ({i18n.t('client.case_note_form.noted')})</Text>
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
            
            <View style={styles.inputWrapper}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color:'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.case_note_form.please_select_all_domain_group')}</Text>
              </View>
              <SectionedMultiSelect
                items={domainGroupsTypes}
                selectText="Choose Domain Groups..."
                uniqueKey="id"
                modalWithSafeAreaView={true}
                showDropDowns={true}
                showCancelButton={true}
                searchPlaceholderText="Search domain groups..."
                onSelectedItemsChange={this.handleChangeDomainGroups}
                selectedItems={this.state.selectedDomainGroups}
                styles={{
                  cancelButton: { width: 150 },
                }}
              />
            </View>

            {
              selectedDomainGroups.length > 0 &&    
              <>
                <View style={styles.inputWrapper}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.label}>{i18n.t('client.case_note_form.note')}</Text>
                  </View>

                  <TextInput
                    autoCapitalize="sentences"
                    placeholder={i18n.t('client.case_note_form.enter_text')}
                    placeholderTextColor="#ccc"
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical="top"
                    style={styles.textarea}
                    value={this.state.note}
                    onChangeText={text => this.updateNote(text)}
                  />
                </View>
                
                {
                  this.props.action === 'create' &&
                  <View style={styles.buttonWrapper}>
                  <Button
                    raised
                    onPress={() => this.uploadAttachment()}
                    backgroundColor="#000"
                    icon={{ name: 'cloud-upload' }}
                    title={i18n.t('client.case_note_form.attachment_button')}
                  />
                </View>
                }

                <View style={styles.buttonWrapper}>
                  <Button
                    raised
                    onPress={() => this.openTaskModal(selectedDomainGroups)}
                    backgroundColor="#088"
                    icon={{ name: 'add-circle' }}
                    title={i18n.t('button.add_task')}
                  />
                </View>
              </>
            }

            <ListAttachments
              attachments={this.state.attachments}
              removeAttactment={this.removeAttactment}
            />
          </Card>

          <DomainGroups 
            caseNoteDomainGroups={this.state.caseNoteDomainGroups}
            selectedDomainGroups={this.state.selectedDomainGroups}
            arisingTasks={this.state.arisingTasks}
            collapsibles={this.state.collapsibles}
            onGoingTasks={this.state.onGoingTasks}
            toggleExpanded={this.toggleExpanded}
            handleTaskCheck={this.handleTaskCheck}
            deleteTask={this.deleteTask}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const mapState = (state, ownProps) => ({
  domains: state.domains.data,
  client: state.clients.data[ownProps.clientId]
})

const mapDispatch = {
  createTask,
  deleteTask,
  saveCaseNote
}

export default connect(mapState, mapDispatch)(CaseNoteForm)
