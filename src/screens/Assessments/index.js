import React, { Component }               from 'react'
import i18n                               from '../../i18n'
import moment                             from 'moment'
import styles                             from './styles'
import appIcon                            from '../../utils/Icon'
import DropdownAlert                      from 'react-native-dropdownalert'
import { connect }                        from 'react-redux'
import { pushScreen }                     from '../../navigation/config'
import { orderBy, maxBy }                 from 'lodash'
import { View, Text, TouchableOpacity }   from 'react-native'
class Assessments extends Component {

  navigateToDetail = async (assessment, assessmentName, isEditable) => {
    const { client, domains } = this.props
    const icons = await appIcon()
    const rightButtons = isEditable ? [{ id: 'SAVE_ASSESSMENT', icon: icons.edit, color: '#fff' }] : []

    pushScreen(this.props.componentId, {
      screen: 'oscar.assessmentDetail',
      title: assessmentName,
      props: {
        assessmentId: assessment.id,
        clientId: client.id,
        domains
      },
      rightButtons
    })
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  onCreateNewAssessment = async isCustom => {
    const { client, domains } = this.props
    const icons = await appIcon()
    if (isCustom) {
      const customDomains = domains.filter(d => d.custom_domain)
      if (customDomains.length === 0) {
        this.refs.dropdown.alertWithType(
          'info',
          'Info',
          i18n.t('client.assessment_form.no_custom_domains_available') + ' ' + i18n.t('client.assessment_form.please_add_custom_domains')
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
        onCreateSuccess: client => this.setState({ client }),
        alertMessage: () => this.alertMessage('Assessment has been successfully created.')
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

  _renderNextAssessment(assessmentType) {
    const { setting, client } = this.props
    const isDefault = assessmentType === 'default'
    const assessments = client.assessments.filter(assessment => assessment.default === isDefault)
    const lastAssessment = maxBy(assessments, 'created_at') || {}
    const today = moment()
    const title = assessmentType === 'default' ? `Next ${setting.default_assessment} on` : `Next ${setting.custom_assessment} on`

    const threeMonthsAfterAssessment = moment(lastAssessment.created_at).add(3, 'months')
    const sixMonthsAfterAssessment = moment(lastAssessment.created_at).add(6, 'months')

    if (assessments.length === 1 && today < threeMonthsAfterAssessment) {
      return <AssessmentButton label={title} value={sixMonthsAfterAssessment.format('LL')} disable />
    }

    return (
      <AssessmentButton label={title} value={sixMonthsAfterAssessment.format('LL')} onPress={() => this.onCreateNewAssessment(!isDefault)} next />
    )
  }

  _renderAssessments() {
    const { setting, client } = this.props
    const assessments = orderBy(client.assessments, ['created_at'], ['asc'])
    const defaultAssessments = assessments.filter(assessment => assessment.default)
    const customAssessments = assessments.filter(assessment => !assessment.default)

    return assessments.map((assessment, index) => {
      const assessmentTitle = assessment.default ? setting.default_assessment : setting.custom_assessment
      const allAssessments = assessment.default ? defaultAssessments : customAssessments
      const isInitail = allAssessments.length > 0 && assessment.id === allAssessments[0].id
      const title = isInitail ? `Initial ${assessmentTitle} on` : `${assessmentTitle} completed on`
      const isEditable = allAssessments.length === 1 || !isInitail

      return (
        <AssessmentButton
          key={index}
          label={title}
          value={moment(assessment.created_at).format('LL')}
          onPress={() => this.navigateToDetail(assessment, assessmentTitle, isEditable)}
        />
      )
    })
  }

  render() {
    const { setting, client } = this.props
    const defaultAssessments = client.assessments.filter(assessment => assessment.default)
    const customAssessments = client.assessments.filter(assessment => !assessment.default)

    return (
      <View style={styles.container}>
        {client.assessments.length > 0 && this._renderAssessments()}
        {setting.enable_default_assessment && defaultAssessments.length === 0 && (
          <AssessmentButton label={`Start Initial ${setting.default_assessment}`} onPress={() => this.onCreateNewAssessment(false)} initail />
        )}
        {setting.enable_default_assessment && defaultAssessments.length > 0 && this._renderNextAssessment('default')}
        {setting.enable_custom_assessment && customAssessments.length === 0 && (
          <AssessmentButton label={`Start Initial ${setting.custom_assessment}`} onPress={() => this.onCreateNewAssessment(true)} initail />
        )}
        {setting.enable_custom_assessment && customAssessments.length > 0 && this._renderNextAssessment('custom')}
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const AssessmentButton = props => {
  let wrapperStyle = [styles.assessmentWrapper]
  props.disable && wrapperStyle.push(styles.disableAssessmentWrapper)
  props.next && wrapperStyle.push(styles.nextAssessmentWrapper)

  const containerStyle = props.initail ? [styles.assessmentContainer, { paddingTop: 30, paddingBottom: 30 }] : styles.assessmentContainer

  const labelStyle = props.disable ? styles.disableLabel : styles.label
  const valueStyle = props.disable ? styles.disableValue : styles.value

  return (
    <TouchableOpacity style={wrapperStyle} onPress={props.onPress}>
      {props.initail && (
        <View style={containerStyle}>
          <Text style={styles.label}>{props.label}</Text>
        </View>
      )}
      {!props.initail && (
        <View style={containerStyle}>
          <Text style={labelStyle}>{props.label}</Text>
          <Text style={valueStyle}>{props.value}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const mapState = (state, ownProps) => ({
  client: state.clients.data[ownProps.clientId],
  domains: state.domains.data
})

export default connect(mapState)(Assessments)
