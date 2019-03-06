import React, { Component } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DropdownAlert from 'react-native-dropdownalert'
import { Navigation } from 'react-native-navigation'
import _ from 'lodash'
import styles from './styles'
import { SCORE_COLOR } from '../../../constants/colors'
import { pushScreen } from '../../../navigation/config'
import i18n from '../../../i18n'

export default class AssessmentDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      client: props.client,
      assessment: props.assessment,
      domains: props.domains
    }

    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed = () => {
    const { client, assessment, domains } = this.state

    pushScreen(this.props.componentId, {
      screen: 'oscar.assessmentForm',
      title: 'Edit Assessment',
      props: {
        client,
        domains,
        assessment,
        action: 'update',
        previousComponentId: this.props.componentId,
        onUpdateSuccess: this.onUpdateSuccess,
        alertMessage: () => this.alertMessage('Assessment has been successfully updated.')
      }
    })
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  onUpdateSuccess = (client, assessment) => this.setState({ client, assessment })

  renderAttachments = attachments => {
    if (attachments.length === 0) return

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{i18n.t('client.assessment_form.attachments')}: </Text>
        {attachments.map((attachment, index) => {
          const filename = attachment.url != undefined ? attachment.url.substring(attachment.url.lastIndexOf('/') + 1) : attachment.name

          return (
            <View key={index}>
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

  renderTasks = tasks => {
    if (tasks.length === 0) return

    return (
      <View>
        <Text style={styles.label}>{i18n.t('client.assessment_form.tasks')}: </Text>
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
    const { domains } = this.state
    const domain = assessmentDomain.domain
    const domainName = `Domain ${domain.name} : ${domain.identity}`

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
            {i18n.t('client.assessment_form.score')} {assessmentDomain.score}
            {!!scoreDefinition && `: ${scoreDefinition}`}
          </Text>
        </View>
        <View style={styles.fieldDataContainer}>
          <Text style={styles.fieldData}>
            <Text style={styles.label}>{i18n.t('client.assessment_form.reason')}: </Text>
            {assessmentDomain.reason}
          </Text>
        </View>
        <View style={styles.fieldDataContainer}>
          <Text style={styles.fieldData}>
            <Text style={styles.label}>{i18n.t('client.assessment_form.goal')}: </Text>
            {assessmentDomain.goal || ''}
          </Text>
        </View>
        <View style={styles.fieldDataContainer}>{this.renderTasks(assessmentDomain.incomplete_tasks)}</View>

        <View style={styles.fieldDataContainer}>{this.renderAttachments(assessmentDomain.attachments)}</View>
      </View>
    )
  }

  render() {
    const { client, assessment } = this.state

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
