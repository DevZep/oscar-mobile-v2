import React, { Component }                             from 'react'
import i18n                                             from '../../../i18n'
import Card                                             from '../../../components/Card'
import Icon                                             from 'react-native-vector-icons/MaterialIcons'
import moment                                           from 'moment'
import appIcon                                          from '../../../utils/Icon'
import ModalImage                                       from '../../../components/ModalImage'
import DropdownAlert                                    from 'react-native-dropdownalert'
import { connect }                                      from 'react-redux'
import { Divider }                                      from 'react-native-elements'
import { map, find, isEmpty }                           from 'lodash'
import { pushScreen }                                   from '../../../navigation/config'
import { enrollmentDetail }                             from '../../../styles'
import { deleteEnrollmentForm, deleteTrackingForm }     from '../../../redux/actions/programStreams'
import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
class EnrollmentDetail extends Component {
  constructor(props) {
    super(props)
    this.state = { isVisible: false, image: null }
  }

  _popupImage = url => {
    this.setState({ isVisible: true, image: url })
  }

  _hideModal = () => {
    this.setState({
      isVisible: false
    })
  }

  _renderFile(files) {
    return map(files, (file, index) => {
      const filename = file.url.substring(file.url.lastIndexOf('/') + 1)
      const extension = filename.split('.').pop()
      return (
        <View key={`${Math.random()}-${index}`} style={[enrollmentDetail.row, enrollmentDetail.imageWrapper]}>
          <Text style={enrollmentDetail.fileName}>{filename}</Text>
          {extension.toLowerCase().match(/jpg|jpeg|png|heic/) && <Icon name="remove-red-eye" size={20} color="#27a5d1" onPress={() => this._popupImage(file.url)} />}
        </View>
      )
    })
  }

  _renderMutipleValue(values) {
    return (
      <View style={enrollmentDetail.row} key={Math.random()}>
        {map(values, (value, vIndex) => {
          return (
            <Text key={`${Math.random()}-${vIndex}`} style={[enrollmentDetail.detailLabel, enrollmentDetail.labelWrapper]}>
              {value}
            </Text>
          )
        })}
      </View>
    )
  }

  _renderField(value, type) {
    return (
      <Text style={enrollmentDetail.detailLabel} key={Math.random()}>
        {type == 'date' && value != '' ? moment(value).format('MMMM D, YYYY') : value}
      </Text>
    )
  }

  _renderParagraph(label) {
    return (
      <View style={enrollmentDetail.fieldContainer}>
        <Text style={[enrollmentDetail.label, enrollmentDetail.labelMargin, { color: '#000' }]}>{label}</Text>
      </View>
    )
  }

  _deleteForm(enrollment) {
    Alert.alert('Warning', `Are you sure you want to delete?`, [
      { text: 'OK', onPress: () => this.handleDeleteAction(enrollment) },
      { text: 'Cancel' }
    ])
  }

  handleDeleteAction = enrollment => {
    if (this.props.type == 'Enroll') {
      this.props.deleteEnrollmentForm(enrollment, this.props.enrollment.id, this.props.client.id, this.props)
    } else {
      const params = {
        id: this.props.enrollmentId,
        tracking_id: enrollment.formId
      }
      this.props.deleteTrackingForm(params, this.props.client.id, this.props.enrollmentId, enrollment.id, this.props, () =>
        this.alertMessage('Tracking has been successfully deleted.')
      )
    }
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  async _editForm(enrollment, deleteAble) {
    const { translations, type, programStream, client, clickForm, componentId } = this.props
    const trackingTranslation = translations.client_enrolled_program_trackings
    const enrollmentTranslations = translations.client_enrolled_programs
    const leaveProgramTranslations = translations.leave_enrolled_programs
    // const enrollmentMessage = enrollmentTranslations.update.successfully_updated
    // const trackingMessage = trackingTranslation.update.successfully_updated
    // const leaveProgramMessage = leaveProgramTranslations.update.successfully_updated
    const enrollmentMessage = 'Enrollment has been successfully updated.'
    const trackingMessage = 'Tracking has been successfully updated.'
    const leaveProgramMessage = 'Leave Program has been successfully updated.'
    const labelDate = type == 'Enroll' ? enrollmentTranslations.form.enrollment_date : leaveProgramTranslations.form.exit_date
    const title = `${type == 'Tracking' ? trackingTranslation.edit.edit_tracking : type == 'Enroll' ? enrollmentTranslations.edit.enrollment : leaveProgramTranslations.edit.leave_program}`
    const message = `${type == 'Tracking' ? trackingMessage : type == 'Enroll' ? enrollmentMessage : leaveProgramMessage}`
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.editForm',
      title,
      props: {
        enrollment: enrollment,
        type: type,
        programStream: programStream,
        clientEnrolledProgramId: enrollment.id,
        enrollment_date: this.props.enrollment.enrollment_date,
        client: client,
        clickForm: clickForm,
        enrollmentDetailComponentId: componentId,
        labelDate,
        alertMessage: () => this.alertMessage(message)
      },
      rightButtons: [
        {
          id: 'UPDATE_FORM',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  renderActions(enrollment, props) {
    const { deleteAble, editAble, type } = props
    if (type == 'Exit') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => this._editForm(enrollment, deleteAble)}>
            <Icon color="#fff" name="edit" size={25} />
          </TouchableWithoutFeedback>
        </View>
      )
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={() => this._editForm(enrollment, deleteAble)}>
          <Icon color="#fff" name="edit" size={25} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this._deleteForm(enrollment)}>
          <Icon color="#fff" name="delete" size={25} />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    const { deleteAble, editAble, enrollment, type } = this.props
    const form = type.match(/Tracking|Enroll/) ? enrollment : enrollment.leave_program
    if (form == undefined) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{i18n.t('no_data')}</Text>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      )
    } else {
      const values = form.properties
      const fields = type == 'Tracking' ? form.tracking_field : type == 'Enroll' ? form.enrollment_field : form.leave_program_field
      const keys = map(fields, 'label')
      const types = map(fields, 'type')
      const cardTitle = `${this.props.type == 'Tracking' ? 'Tracking' : this.props.type == 'Enroll' ? 'Enrolled ' : 'Exited'}`
      const date = `${this.props.type == 'Tracking' ? form.created_at : this.props.type == 'Enroll' ? form.enrollment_date : form.exit_date}`
      const newDate = !isEmpty(date) ? moment(date).format('D MMM, YYYY') : ''
      const title = `on ${newDate}`
      return (
        <View style={{ flex: 1 }}>
          <ScrollView style={enrollmentDetail.container}>
            <Card
              style={{ paddingTop: 30, paddingLeft: 10, paddingRight: 10 }}
              title={cardTitle + ' ' + title}
              rightButton={this.renderActions(form, this.props)}
            >
              <ScrollView ref="caseNoteCard">
                {map(keys, (field, index) => {
                  if (types[index] != 'separateLine') {
                    return (
                      <View key={`${Math.random()}-${index}`}>
                        <View style={enrollmentDetail.fieldContainer}>
                          <Text style={[enrollmentDetail.label, enrollmentDetail.labelMargin]}>{field}</Text>
                          {typeof values[field] == 'object' && values[field] != '' && values[field] != null && values[field].length > 0
                            ? types[index] == 'file'
                              ? this._renderFile(values[field])
                              : this._renderMutipleValue(values[field])
                            : this._renderField(values[field], types[index])}
                        </View>
                        <Divider style={{ backgroundColor: '#EDEFF1', marginTop: 6 }} />
                      </View>
                    )
                  }
                })}
              </ScrollView>
              <ModalImage isVisible={this.state.isVisible} image={this.state.image} hideModal={this._hideModal} />
            </Card>
          </ScrollView>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      )
    }
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
  let enrollment = programStream != undefined && find(programStream.enrollments, { id: ownProps.enrollmentId })
  if (ownProps.type == 'Tracking') {
    enrollment = find(enrollment.trackings, { id: ownProps.formId })
  }
  return { client, programStream, enrollment, translations }
}

const mapDispatch = {
  deleteEnrollmentForm,
  deleteTrackingForm
}

export default connect(
  mapState,
  mapDispatch
)(EnrollmentDetail)
