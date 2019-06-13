import React, { Component }           from 'react'
import i18n                           from '../../../i18n'
import Card                           from '../../../components/Card'
import Icon                           from 'react-native-vector-icons/MaterialIcons'
import moment                         from 'moment'
import Swiper                         from 'react-native-swiper'
import Field                          from '../../../components/Field'
import appIcon                        from '../../../utils/Icon'
import DropdownAlert                  from 'react-native-dropdownalert'
import { connect }                    from 'react-redux'
import { Navigation }                 from 'react-native-navigation'
import { pushScreen }                 from '../../../navigation/config'
import { map, filter, find }          from 'lodash'
import { deleteTrackingForm }         from '../../../redux/actions/programStreams'
import { additionalFormDetailList }   from '../../../styles'
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'

const { height } = Dimensions.get('window')
class ListTrackingReport extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = { visible: true }
  }

  async navigationButtonPressed({ buttonId }) {
    const icons = await appIcon()
    const { client, programStream, tracking } = this.props
    if (buttonId === 'ADD_TRACKING') {
      pushScreen(this.props.componentId, {
        screen: 'oscar.trackingForm',
        title: tracking.name,
        props: {
          tracking: tracking,
          programStream: programStream,
          client: client,
          listTrackingComponentId: this.props.componentId,
          action: 'create',
          type: 'create',
          alertMessage: () => this.alertMessage('Tracking has been successfully created.')
        },
        rightButtons: [
          {
            id: 'SAVE_TRACKING',
            icon: icons.save,
            color: '#fff'
          }
        ]
      })
    }
  }

  editTrackingForm = async trackingProperty => {
    const { client, programStream, translations } = this.props
    const trackingTranslation = translations.client_enrolled_program_trackings
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.trackingForm',
      title: trackingTranslation.edit.edit_tracking,
      props: {
        tracking: trackingProperty,
        programStream: programStream,
        client: client,
        type: 'Tracking',
        action: 'edit',
        clickForm: this.props.clickForm,
        enrollmentDetailComponentId: this.props.componentId,
        alertMessage: () => this.alertMessage('Tracking has been successfully updated.')
      },
      rightButtons: [
        {
          id: 'SAVE_TRACKING',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  deleteTracking = tracking => {
    const { client, deleteTrackingForm } = this.props
    const params = { id: tracking.client_enrollment_id, tracking_id: tracking.id }
    Alert.alert('Warning', 'Are you sure you want to delete?', [
      {
        text: 'OK',
        onPress: () =>
          deleteTrackingForm(params, client.id, tracking.client_enrollment_id, tracking.id, this.props, () =>
            this.alertMessage('Tracking has been successfully deleted.')
          )
      },
      { text: 'Cancel' }
    ])
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  _renderField(Key, Value) {
    return (
      <View key={Key}>
        <Field name={Key} value={Value} />
      </View>
    )
  }

  renderFile = (key, files) => {
    return (
      <View key={key} style={additionalFormDetailList.fieldContainer}>
        <View>
          <Text style={additionalFormDetailList.field}>{key}</Text>
          {files.map((file, index) => {
            let url = file.url
            if (url == undefined) {
              url = file.name
            }
            if (url != undefined) {
              const filename = url.substring(url.lastIndexOf('/') + 1)
              if (filename != 'image-placeholder.png') {
                return (
                  <View key={index} style={additionalFormDetailList.multipleFiledContainer}>
                    <Image resizeMode="center" style={additionalFormDetailList.thumnail} source={{ uri: file.url != undefined ? url : file.uri }} />
                    <Text style={[additionalFormDetailList.fieldData]}>{filename.substring(filename.length - 20, filename.length)}</Text>
                  </View>
                )
              }
            }
          })}
        </View>
      </View>
    )
  }

  renderFormField = custom_field => {
    const self = this
    const { tracking } = this.props
    const fieldsKey = map(tracking.fields, 'label')
    const fieldsType = map(tracking.fields, 'type')
    const filedProperties = custom_field.properties
    return map(fieldsKey, (field, index) => {
      let customerForms = []
      const label = filedProperties[field.replace(/<[^>]+>|;/g, '')]
      if (fieldsType[index] != 'separateLine') {
        if (label != undefined && typeof label === 'string') {
          let type = null
          if (fieldsType[index] == 'date') {
            type = 'date'
          }
          customerForms = customerForms.concat(self._renderField(field.replace(/<[^>]+>|;/g, ''), label))
        } else if (label != undefined && typeof label === 'object') {
          const sub = label.toString()
          if (label[0] != undefined && label[0].url != undefined) {
            customerForms = customerForms.concat(self.renderFile(field.replace(/<[^>]+>|;/g, ''), label))
          } else {
            customerForms = customerForms.concat(self._renderField(field.replace(/<[^>]+>|;/g, ''), sub))
          }
        }
      }
      return <View key={index}>{customerForms}</View>
    })
  }

  renderActions = tracking => {
    return (
      <View style={additionalFormDetailList.iconWrapper}>
        <TouchableWithoutFeedback onPress={() => this.editTrackingForm(tracking)}>
          <View>
            <Icon color="#fff" name="edit" size={25} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.deleteTracking(tracking)}>
          <View style={additionalFormDetailList.deleteIcon}>
            <Icon color="#fff" name="delete" size={25} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    const { visible } = this.state
    const { enrollment } = this.props
    const { mainContainer } = additionalFormDetailList
    const trackings = filter(enrollment.trackings, { tracking_id: this.props.tracking.id })

    if (trackings.length == 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{i18n.t('no_data')}</Text>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <Swiper height={visible ? height - 82 : height - 81} showsButtons={false} loop={false} style={mainContainer} paginationStyle={{ bottom: 10 }}>
          {trackings.map((tracking, index) => {
            const createdAt = moment(tracking.created_at).format('DD MMMM, YYYY')
            return (
              <View key={index}>
                <Card style={{ paddingTop: 30, paddingLeft: 20, paddingRight: 20 }} title={createdAt} rightButton={this.renderActions(tracking)}>
                  <View key={tracking.id.toString()}>
                    <ScrollView ref="caseNoteCard">{this.renderFormField(tracking)}</ScrollView>
                  </View>
                </Card>
              </View>
            )
          })}
        </Swiper>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => {
  const client = state.clients.data[ownProps.clientId]
  const programStream = find(client.program_streams, { id: ownProps.programStreamId })
  const enrollment = find(programStream.enrollments, { id: ownProps.enrollmentId })
  const language = state.language.language
  const translations = state.translations.data[language]
  return { client, programStream, enrollment, translations }
}

const mapDispatch = {
  deleteTrackingForm
}

export default connect(
  mapState,
  mapDispatch
)(ListTrackingReport)
