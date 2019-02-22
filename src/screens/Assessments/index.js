import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import moment from 'moment'
import _      from 'lodash'
import styles from './styles'
import i18n from '../../navigation/config'
import { pushScreen } from '../../navigation/config'
import appIcon from '../../utils/Icon'

class Assessments extends Component {
  state = {
    client: this.props.client,
    domains: this.props.domains
  }

  navigateToDetail = async (assessment, assessmentName, isEditable) => {
    const { client, domains } = this.state
    const icons = await appIcon()
    const rightButtons = isEditable ? [{ id: 'SAVE_ASSESSMENT', icon: icons.edit, color: "#fff" }] : []

    pushScreen(this.props.componentId, {
      screen: 'oscar.assessmentDetail',
      title: assessmentName,
      props: {
        assessment,
        client,
        domains,
      },
      rightButtons
    })
  }

  onCreateNewAssessment = isCustom => {
    const { client, domains } = this.state

    if (isCustom) {
      const customDomains = domains.domains.filter(d => d.custom_domain)
      if (customDomains.length === 0) {
        Alert.alert(
          i18n.t('client.assessment_form.no_custom_domains_available'),
          i18n.t('client.assessment_form.please_add_custom_domains')
        )
        return
      }
    }

    pushScreen(this.props.componentId, {
      screen: 'oscar.assessmentForm',
      title: 'Create Assessment',
      props: {
        client,
        domains,
        action: 'create',
        custom_domain: isCustom,
        previousComponentId: this.props.componentId,
        onCreateSuccess: (client) => this.setState({ client })
      }
    })
  }

  _renderNextAssessment(assessmentType) {
    const { setting }     = this.props
    const { client }      = this.state
    const isDefault       = assessmentType === 'default'
    const assessments     = client.assessments.filter(assessment => assessment.default === isDefault)
    const lastAssessment  = _.maxBy(assessments, 'created_at') || {}
    const today           = moment()
    const title           = assessmentType === 'default'
                              ? `Next ${setting.default_assessment} on`
                              : `Next ${setting.custom_assessment} on`

    const threeMonthsAfterAssessment = moment(lastAssessment.created_at).add(3, 'months')
    const sixMonthsAfterAssessment   = moment(lastAssessment.created_at).add(6, 'months')
    // const hasIncompletedAssessment   = _.some(assessments, { completed: false })

    // if (hasIncompletedAssessment ||
    //   (assessments.length === 1 && today < threeMonthsAfterAssessment)
    // ) {
    if (assessments.length === 1 && today < threeMonthsAfterAssessment) {
      return (
        <AssessmentButton
          label={ title }
          value={ sixMonthsAfterAssessment.format('LL') }
          disable
        />
      )
    }

    return (
      <AssessmentButton
        label={ title }
        value={ sixMonthsAfterAssessment.format('LL') }
        onPress={ () => this.onCreateNewAssessment(!isDefault) }
        next
      />
    )
  }

  _renderAssessments() {
    const { setting }         = this.props
    const { client }          = this.state
    const assessments         = _.orderBy(client.assessments, ['created_at'], ['asc'])
    const defaultAssessments  = assessments.filter(assessment => assessment.default)
    const customAssessments   = assessments.filter(assessment => !assessment.default)

    return assessments.map((assessment, index) => {
      const assessmentTitle = assessment.default
                                ? setting.default_assessment
                                : setting.custom_assessment
      const allAssessments  = assessment.default
                                ? defaultAssessments
                                : customAssessments
      const isInitail       = allAssessments.length > 0
                                && assessment.id === allAssessments[0].id
      const title           = isInitail
                                ? `Initial ${assessmentTitle} on`
                                : `${assessmentTitle} completed on`
      const isEditable      = allAssessments.length === 1 || !isInitail

      return (
        <AssessmentButton
          key={ index }
          label={ title }
          value={ moment(assessment.created_at).format('LL') }
          onPress={ () => this.navigateToDetail(assessment, assessmentTitle, isEditable) }
        />
      )
    })
  }

  render() {
    const { setting }         = this.props
    const { client }          = this.state
    const defaultAssessments  = client.assessments.filter(assessment => assessment.default)
    const customAssessments   = client.assessments.filter(assessment => !assessment.default)

    return (
      <View style={styles.container}>
        {
          client.assessments.length > 0 &&
            this._renderAssessments()
        }
        {
          setting.enable_default_assessment &&
          defaultAssessments.length === 0 &&
            <AssessmentButton
              label={ `Start Initial ${setting.default_assessment}` }
              onPress={ () => this.onCreateNewAssessment(false) }
              initail
            />
        }
        {
          setting.enable_default_assessment &&
          defaultAssessments.length > 0 &&
            this._renderNextAssessment('default')
        }
        {
          setting.enable_custom_assessment &&
          customAssessments.length === 0 &&
            <AssessmentButton
              label={ `Start Initial ${setting.custom_assessment}` }
              onPress={ () => this.onCreateNewAssessment(true) }
              initail
            />
        }
        {
          setting.enable_custom_assessment &&
          customAssessments.length > 0 &&
            this._renderNextAssessment('custom')
        }
      </View>
    )
  }
}

const AssessmentButton = (props) => {
  let wrapperStyle = [ styles.assessmentWrapper ]
  props.disable && wrapperStyle.push(styles.disableAssessmentWrapper)
  props.next    && wrapperStyle.push(styles.nextAssessmentWrapper)

  const containerStyle = props.initail ?
    [styles.assessmentContainer, { paddingTop: 30, paddingBottom: 30 }] :
    styles.assessmentContainer

  const labelStyle = props.disable ? styles.disableLabel : styles.label
  const valueStyle = props.disable ? styles.disableValue : styles.value

  return (
    <TouchableOpacity
      style={ wrapperStyle }
      onPress={ props.onPress }
    >
      {
        props.initail &&
        <View style={ containerStyle }>
          <Text style={ styles.label }>{ props.label }</Text>
        </View>
      }
      {
        !props.initail &&
          <View style={ containerStyle }>
            <Text style={ labelStyle }>{ props.label }</Text>
            <Text style={ valueStyle }>{ props.value }</Text>
          </View>
      }
    </TouchableOpacity>
  )
}

const mapState = (state, ownProps) => ({
  client: state.clients.data[ownProps.clientId],
  domains: state.domains.data
})

export default connect(mapState)(Assessments)
