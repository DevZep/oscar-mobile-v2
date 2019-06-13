import React, { Component }         from 'react'
import { connect }                  from 'react-redux'
import { Navigation }               from 'react-native-navigation'
import { pushScreen }               from '../../../navigation/config'
import _                            from 'lodash'
import i18n                         from '../../../i18n'
import styles                       from './styles'
import moment                       from 'moment'
import appIcons                     from '../../../utils/Icon'
import DropdownAlert                from 'react-native-dropdownalert'
import {
  View,
  Text,
  ScrollView,
  Image
} from 'react-native'
class CaseNoteDetail extends Component {
  state = {
    client: this.props.client,
    caseNote: this.props.caseNote
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed = async () => {
    const icons = await appIcons()
    const { caseNote, client} = this.state

    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNoteForm',
      title: i18n.t('client.case_note_form.edit_title'),
      props: {
        client,
        caseNote,
        action: 'update',
        custom: caseNote.custom,
        previousComponentId: this.props.componentId,
        onSaveSuccess: this.onSaveSuccess
      },
      rightButtons: [{
        id: 'SAVE_CASE_NOTE',
        icon: icons.save,
        color: '#fff'
      }]
    })
  }

  onSaveSuccess = client => {
    const { caseNote } = this.props
    const updatedCaseNote = client.case_notes.find(case_note => case_note.id === caseNote.id)

    this.refs.dropdown.alertWithType('success', 'Success', 'Client has been successfully updated.')
    this.setState({ caseNote: updatedCaseNote, client })
  }

  renderNotes = (case_note, noteTranslation) => (
    <View style={styles.fieldDataWrapper}>
      <Text style={styles.label}>{noteTranslation} : </Text>
      <Text style={styles.textData}>{case_note.note}</Text>
    </View>
  )

  renderGoals = (case_note, goalTranslation) => {
    const { assessments } = this.props.client

    if (assessments.length === 0) return

    const assessment = assessments.find(assessment => assessment.id === this.props.caseNote.assessment_id)

    if (_.isUndefined(assessment)) return

    const assessmentDomainsWithGoal = assessment.assessment_domain.filter(ad => Boolean(ad.goal))
    const caseNoteDomainIds = case_note.domain_scores.map(ds => ds.domain_id)
    const availableAssessmentDomains = assessmentDomainsWithGoal.filter(ad => caseNoteDomainIds.includes(ad.domain_id))

    if (availableAssessmentDomains.length === 0) return

      return (
        <View style={styles.fieldDataWrapper}>
          <View>
            <Text style={styles.label}>{goalTranslation} : </Text>
            {
              availableAssessmentDomains.map((ad, index) => (
                <View key={index}>
                  <Text style={styles.listAttachments}>
                    {index + 1}. {ad.goal}
                  </Text>
                </View>
              ))
            }
          </View>
        </View>
      )
  }

  renderTasks = (case_note, completedTasksTranslation) => (
    <View style={styles.fieldDataWrapper}>
      <View>
        <Text style={styles.label}>{completedTasksTranslation}: </Text>

        {case_note.completed_tasks.map((task, index) => {
          return (
            <View key={index}>
              <Text style={styles.listAttachments}>
                {index + 1}. <Text>{task.name}</Text>
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )

  renderAttachments = (case_note, attachmentsTranslation) => (
    <View>
      <Text style={styles.label}>{attachmentsTranslation}: </Text>
      {
        case_note.attachments.map((attachment, index) => {
          const url = attachment.url || attachment.name
          const filename = url.substring(url.lastIndexOf('/') + 1)
          return (
            <View key={index} style={styles.attachmentWrapper}>
              <Image
                style={{ width: 40, height: 40 }}
                source={{ uri: attachment.url }}
              />
              <Text style={styles.listAttachments}>
                {index + 1}. {filename}
              </Text>
            </View>
          )
        })
      }
    </View>
  )

  render() {
    const { caseNote } = this.state
    const { translations } = this.props

    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.attendeeTitle}>
                {caseNote.attendee}{' '}
                {caseNote.interaction_type != '' && `( ${caseNote.interaction_type} )`}
            </Text>
            <Text style={styles.meetingDate}>
              {moment(caseNote.meeting_date).format('MMMM Do YYYY')}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ paddingLeft: 20, paddingRight: 20 }}>
            {
              caseNote.case_note_domain_group.filter(cndg => !!cndg.note).map((case_note, index) => {
                const tasks = case_note.tasks || case_note.completed_tasks
                const attachments = case_note.attachments || []

                return (
                  <View key={index} style={styles.fieldContainer}>
                    <View style={styles.field}>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        {case_note.domain_group_identities}
                      </Text>
                    </View>

                    <View style={styles.contentWrapper}>
                      { this.renderNotes(case_note, translations.note) }
                      { this.renderGoals(case_note, translations.goal) }
                      { tasks.length > 0 && this.renderTasks(case_note, translations.completed_tasks) }
                      { attachments.length > 0 && this.renderAttachments(case_note, translations.attachments) }
                    </View>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = state => {
  const language = state.language.language
  const translations = state.translations.data[language].case_notes.index
  return {
    translations
 }
}

export default connect(mapState)(CaseNoteDetail)
