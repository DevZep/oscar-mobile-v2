import React, { Component }         from 'react'
import _                            from 'lodash'
import Icon                         from 'react-native-vector-icons/MaterialIcons'
import styles                       from './styles'
import DropdownAlert                from 'react-native-dropdownalert'
import { connect }                  from 'react-redux'
import { Navigation }               from 'react-native-navigation'
import { pushScreen }               from '../../../navigation/config'
import { SCORE_COLOR }              from '../../../constants/colors'
import appIcons                     from '../../../utils/Icon'
import {
  View,
  Text,
  ScrollView,
  Image
} from 'react-native'
class AssessmentDetail extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed = async () => {
    const { client, assessment, domains } = this.props
    const icons = await appIcons()
    pushScreen(this.props.componentId, {
      screen: 'oscar.assessmentForm',
      title: 'Edit Assessment',
      props: {
        client,
        domains,
        assessment,
        action: 'update',
        previousComponentId: this.props.componentId,
        alertMessage: () => this.alertMessage('Assessment has been successfully updated.')
      },
      rightButtons: [
        {
          id: 'SAVE_ASSESSMENT',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  renderAttachments = (attachments, attachmentsTranslation) => {
    if (attachments.length === 0) return

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{attachmentsTranslation}: </Text>
        {attachments.map((attachment, index) => {
          const filename = attachment.url != undefined ? attachment.url.substring(attachment.url.lastIndexOf('/') + 1) : attachment.name

          return (
            <View key={index} style={styles.attachmentWrapper}>
              <Image
                style={{ width: 40, height: 40 }}
                source={{ uri: attachment.url }}
              />
              <Text style={styles.listAttachments}>
                {index + 1}. {filename}
              </Text>
              <View style={styles.attachmentSeparator} />
            </View>
          )
        })}
      </View>
    )
  }

  renderTasks = (tasks, tasksTranslation) => {
    if (tasks == undefined || tasks.length === 0) return

    return (
      <View>
        <Text style={styles.label}>{tasksTranslation}: </Text>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Icon size={10} name="label" color="#fff" style={{ marginTop: 4 }} />
            <Text style={styles.taskItemText}>{task.name}</Text>
          </View>
        ))}
      </View>
    )
  }

  renderScoreBox(assessmentDomain, scoreColor, previousScoreColor) {
    const { score, previous_score } = assessmentDomain

    if (previous_score)
      return (
        <View style={styles.scoreContainer}>
          <Text style={[styles.dualScore, { marginRight: 5, marginLeft: 0, backgroundColor: previousScoreColor }]}>{previous_score}</Text>
          <Icon name="trending-flat" size={15} />
          <Text style={[styles.dualScore, { backgroundColor: scoreColor, width: score ? 'auto' : 18, height: score ? 'auto' : 27 }]}>{score}</Text>
        </View>
      )

    if (score)
      return (
        <View style={styles.scoreContainer}>
          <Text style={[styles.singleScore, { backgroundColor: scoreColor || previousScoreColor }]}>{score || previous_score}</Text>
        </View>
      )
  }

  renderClientName = ({ family_name, given_name }) => (
    <View style={styles.clientNameContainer}>
      <Text style={styles.clientNameLabel}>Client Name</Text>
      <Text style={styles.clientNameValue}>{[family_name, given_name].filter(Boolean).join(' ') || '(No Name)'}</Text>
    </View>
  )

  renderAssessmentDomain = (assessmentDomain, index) => {
    const { domains, translations } = this.props
    const assessmentDetailTranslations = translations.assessments.show
    const attachmentTranslations = translations.assessments.attachment
    const domain = _.find(domains, {id: assessmentDomain.domain_id})
    const domainName = `${assessmentDetailTranslations.domain} ${domain.name} : ${domain.identity}`

    const score = domains[index][`score_${assessmentDomain.score}`]
    const scoreColor = score ? SCORE_COLOR[score.color] : 'gray'

    const previousScore = domains[index][`score_${assessmentDomain.previous_score}`]
    const previousScoreColor = previousScore && SCORE_COLOR[previousScore.color]

    const scoreDefinition = score && score.definition
    const cardColor = scoreColor || previousScoreColor

    return (
      <View key={index} style={[styles.assessmentContainer, { backgroundColor: cardColor }]}>
        <View style={styles.domainContainer}>
          <View style={[styles.fieldDataContainer, { alignItems: 'center' }]}>
            <Text style={styles.label}>{domainName}</Text>
          </View>
          {this.renderScoreBox(assessmentDomain, scoreColor, previousScoreColor)}
        </View>
        <View style={styles.fieldDataContainer}>
          <Text style={[styles.label, styles.fieldData]}>
            {assessmentDetailTranslations.score} {assessmentDomain.score}
            {!!scoreDefinition && `: ${scoreDefinition}`}
          </Text>
        </View>
        <View style={styles.fieldDataContainer}>
          <Text style={styles.fieldData}>
            <Text style={styles.label}>{assessmentDetailTranslations.reason}: </Text>
            {assessmentDomain.reason}
          </Text>
        </View>
        <View style={styles.fieldDataContainer}>
          <Text style={styles.fieldData}>
            <Text style={styles.label}>{assessmentDetailTranslations.goal}: </Text>
            {assessmentDomain.goal || ''}
          </Text>
        </View>
        <View style={styles.fieldDataContainer}>{this.renderTasks(assessmentDomain.incomplete_tasks, assessmentDetailTranslations.task)}</View>

        <View style={styles.fieldDataContainer}>{this.renderAttachments(assessmentDomain.attachments, attachmentTranslations.attachments)}</View>
      </View>
    )
  }

  render() {
    const { client, assessment } = this.props

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          {this.renderClientName(client)}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            {assessment.assessment_domain.map(this.renderAssessmentDomain)}
          </ScrollView>
        </View>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}


const mapState = (state, ownProps) => {
  const language = state.language.language
  const translations = state.translations.data[language]
  const client = state.clients.data[ownProps.clientId]
  const assessment = _.find(client.assessments, {id: ownProps.assessmentId})
  return {
    client,
    assessment,
    translations
  }
}

export default connect(mapState)(AssessmentDetail)