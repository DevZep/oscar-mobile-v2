import React, { Component }           from 'react'
import i18n                           from '../../../i18n'
import Icon                           from 'react-native-vector-icons/Ionicons'
import moment                         from 'moment'
import DropdownAlert                  from 'react-native-dropdownalert'
import { connect }                    from 'react-redux'
import { pushScreen }                 from '../../../navigation/config'
import { map, isEmpty, find }         from 'lodash'
import { programStreamDetail }        from '../../../styles'
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
class ProgramStreamDetail extends Component {
  _updateProgramStreamReportState = (data, type) => {
    let { programStream } = this.props
    let updatedEnrollments = programStream.enrollments
    let updatedProgramStream = []

    if (type === 'Enroll') {
      updatedEnrollments = map(updatedEnrollments, (enrollment, index) => {
        if (enrollment.id == data.id) {
          let updatedEnrollProgram = Object.assign({}, enrollment, {
            properties: data.properties,
            enrollment_date: data.enrollment_date
          })
          return updatedEnrollProgram
        } else {
          return enrollment
        }
      })
    } else if (type === 'Exit') {
      updatedEnrollments = map(updatedEnrollments, (enrollment, index) => {
        if (enrollment.leave_program != null && enrollment.leave_program.id == data.id) {
          let updatedLeaveProgram = Object.assign({}, enrollment.leave_program, {
            properties: data.properties,
            exit_date: data.exit_date
          })

          const updatedExitProgram = Object.assign({}, enrollment, {
            leave_program: updatedLeaveProgram
          })
          return updatedExitProgram
        }
        return enrollment
      })
    } else if (type === 'Tracking') {
      updatedEnrollments = map(updatedEnrollments, (enrollment, index) => {
        if (enrollment.trackings.length > 0) {
          const updatedTracking = map(enrollment.trackings, tracking => {
            if (tracking.id == data.id) {
              const updatedTracking = Object.assign({}, tracking, {
                properties: data.properties
              })
              return updatedTracking
            }
            return tracking
          })

          const updatedTrackingProgram = Object.assign({}, enrollment, {
            trackings: updatedTracking
          })
          return updatedTrackingProgram
        }
        return enrollment
      })
    }

    updatedProgramStream = Object.assign({}, programStream, {
      enrollments: updatedEnrollments
    })

    this.setState({
      programStream: updatedProgramStream
    })
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  _renderEnrollmentDetail = (enrollment, deleteAble, formType, editAble, enrollment_id) => {
    const { translations } = this.props
    const trackingTranslation = translations.client_enrolled_program_trackings
    const enrollmentTranslations = translations.client_enrolled_programs
    const leaveProgramTranslations = translations.leave_enrolled_programs
    const enrollmentMessage = enrollmentTranslations.create.successfully_created
    const trackingMessage = trackingTranslation.create.successfully_created
    const leaveProgramMessage = leaveProgramTranslations.create.successfully_created
    const title = `${formType == 'Tracking' ? trackingTranslation.new.new_tracking : formType == 'Enroll' ? enrollmentTranslations.new.new_enrollment : leaveProgramTranslations.new.new_exit_program}`
    const message = formType == 'Tracking' ? trackingMessage : formType == 'Enroll' ? enrollmentMessage : leaveProgramMessage
    pushScreen(this.props.componentId, {
      screen: 'oscar.enrollmentDetail',
      title,
      props: {
        enrollmentId: enrollment_id,
        formId: enrollment.id,
        deleteAble: deleteAble,
        editAble: editAble,
        programStreamId: this.props.programStream.id,
        type: formType,
        clientId: this.props.client.id,
        clickForm: this.props.clickForm,
        programStreamDetailComponentId: this.props.componentId,
        clientDetailComponentId: this.props.clientDetailComponentId,
        alertMessage: () => this.alertMessage(message),
        alertEnrollmentMessage: () => this.alertMessage('Enrollment has been successfully deleted.')
      }
    })
  }

  _renderEnrollment(date, formTitle, enrollment, deleteAble, type, editAble, enrollment_id) {
    const newDate = !isEmpty(date) ? moment(date).format('D MMM, YYYY') : ''
    const title = `on ${newDate}`
    return (
      <View key={`${Math.random()}-${title}`} style={[programStreamDetail.tableDetailRow, programStreamDetail.tableRow]}>
        <View style={programStreamDetail.column}>
          <Text style={programStreamDetail.detailLabel}>{moment(date).format('D MMM, YYYY')}</Text>
        </View>
        <View style={programStreamDetail.column}>
          <Text style={programStreamDetail.detailLabel}>{formTitle}</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => this._renderEnrollmentDetail(enrollment, deleteAble, type, editAble, enrollment_id)}>
          <View style={programStreamDetail.column}>
            <Icon name="ios-eye" size={25} style={[programStreamDetail.detailLabel, { color: '#009999' }]} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _renderTracking(trackings, enrollment, editAble, deleteAble) {
    return map(trackings, tracking => {
      return this._renderEnrollment(tracking.created_at, 'Tracking', tracking, deleteAble, 'Tracking', editAble, enrollment.id)
    })
  }

  _renderEnrolledForm(enrollment) {
    return (
      <View key={Math.random()}>
        {this._renderEnrollment(enrollment.enrollment_date, 'Enrollment', enrollment, true, 'Enroll', true, enrollment.id)}
        {enrollment.trackings.length > 0 && this._renderTracking(enrollment.trackings, enrollment, true, true)}
      </View>
    )
  }

  _renderExit(enrollment) {
    return (
      <View key={Math.random()}>
        {this._renderEnrollment(enrollment.leave_program.exit_date, 'Exit', enrollment, false, 'Exit', true, enrollment.id)}
        {enrollment.trackings.length > 0 && this._renderTracking(enrollment.trackings, enrollment, false, false)}
        {this._renderEnrollment(enrollment.enrollment_date, 'Enrollment', enrollment, true, 'Enroll', true, enrollment.id)}
      </View>
    )
  }

  render() {
    const { programStream, translations } = this.props
    const reportProgramStreamTranslations = translations.client_enrollments.report
    if (programStream == undefined) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{i18n.t('no_data')}</Text>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      )
    }

    return (
      <View style={programStreamDetail.container}>
        <View style={programStreamDetail.tableWrapper}>
          {programStream.enrollments.length > 0 && (
            <View style={[programStreamDetail.tableRow, programStreamDetail.tableHeader]}>
              <View style={programStreamDetail.headerColumn}>
                <Text style={programStreamDetail.headerLabel}>{reportProgramStreamTranslations.date}</Text>
              </View>
              <View style={programStreamDetail.headerColumn}>
                <Text style={programStreamDetail.headerLabel}>{reportProgramStreamTranslations.forms}</Text>
              </View>
              <View style={programStreamDetail.headerColumn}>
                <Text style={programStreamDetail.headerLabel}>{reportProgramStreamTranslations.actions}</Text>
              </View>
            </View>
          )}
          <ScrollView>
            {map(programStream.enrollments, enrollment => {
              return enrollment.leave_program != null ? this._renderExit(enrollment) : this._renderEnrolledForm(enrollment)
            })}
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
  const programStream =
    ownProps.clickForm == 'EnrolledProgram'
      ? find(client.program_streams, { id: ownProps.programStreamId })
      : find(client.inactive_program_streams, { id: ownProps.programStreamId })
  return { client, programStream, translations }
}

export default connect(mapState)(ProgramStreamDetail)
