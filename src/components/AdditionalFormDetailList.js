import React, { Component }           from 'react'
import Card                           from './Card'
import i18n                           from '../i18n'
import Icon                           from 'react-native-vector-icons/MaterialIcons'
import Field                          from './Field'
import moment                         from 'moment'
import Swiper                         from 'react-native-swiper'
import appIcon                        from '../utils/Icon'
import DropdownAlert                  from 'react-native-dropdownalert'
import { connect }                    from 'react-redux'
import { map, find }                  from 'lodash'
import { pushScreen }                 from '../navigation/config'
import { Navigation }                 from 'react-native-navigation'
import { additionalFormDetailList }   from '../styles'
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'

const { height } = Dimensions.get('window')
class AdditionalFormDetailList extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'ADD_CUSTOM_FORM') {
      const icons = await appIcon()
      const { customForm, entity, componentId, type } = this.props
      pushScreen(componentId, {
        screen: 'oscar.createCustomForm',
        title: customForm.form_title,
        props: {
          entity: entity,
          customForm: customForm,
          entityDetailComponentId: componentId,
          type: type,
          clickForm: 'additionalForm',
          alertMessage: () => this.alertMessage('Custom Field Properties has been successfully created.')
        },
        rightButtons: [
          {
            id: 'SAVE_CUSTOM_FORM',
            icon: icons.save,
            color: '#fff'
          }
        ]
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customForm === undefined) {
      Navigation.mergeOptions(nextProps.componentId, {
        topBar: {
          rightButtons: []
        }
      })
    }
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  deleteAdditionalForm = customForm => {
    const { deleteAdditionalForm, entity } = this.props
    Alert.alert('Warning', 'Are you sure you want to delete?', [
      {
        text: 'OK',
        onPress: () =>
          deleteAdditionalForm(customForm, entity, this.props, () => this.alertMessage('Custom Field Properties has been successfully deleted.'))
      },
      { text: 'Cancel' }
    ])
  }

  editAdditionalForm = async customFieldProperty => {
    const icons = await appIcon()
    const { customForm, entity, type, componentId } = this.props
    pushScreen(componentId, {
      screen: 'oscar.editCustomForm',
      title: customForm.form_title,
      props: {
        customForm: customForm,
        custom_field: customFieldProperty,
        entity: entity,
        type: type,
        currentComponentId: componentId,
        alertMessage: () => this.alertMessage('Custom Field Properties has been successfully updated.')
      },
      rightButtons: [
        {
          id: 'SAVE_CUSTOM_FORM',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  renderField(Key, Value) {
    return (
      <View key={Key}>
        <Field name={Key} value={Value} />
      </View>
    )
  }

  renderFile(key, files) {
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

  renderActions(customFieldProperty) {
    return (
      <View style={additionalFormDetailList.iconWrapper}>
        <TouchableWithoutFeedback onPress={() => this.editAdditionalForm(customFieldProperty)}>
          <View>
            <Icon color="#fff" name="edit" size={25} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.deleteAdditionalForm(customFieldProperty)}>
          <View style={additionalFormDetailList.deleteIcon}>
            <Icon color="#fff" name="delete" size={25} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderFormField = customFieldProperty => {
    const self = this
    const { customForm } = this.props
    const fieldsKey = map(customForm.fields, 'label')
    const fieldsType = map(customForm.fields, 'type')
    const filedProperties = customFieldProperty.properties
    return map(fieldsKey, (field, index) => {
      let customFieldProperties = []
      if (fieldsType[index] != 'separateLine') {
        if (filedProperties[field] != undefined && typeof filedProperties[field] === 'string') {
          let type = null
          if (fieldsType[index] == 'date') {
            type = 'date'
          }
          customFieldProperties = customFieldProperties.concat(self.renderField(field, filedProperties[field]))
        } else if (filedProperties[field] != undefined && typeof filedProperties[field] === 'object') {
          const sub = filedProperties[field].toString()
          if (filedProperties[field][0] != undefined && filedProperties[field][0].url != undefined) {
            customFieldProperties = customFieldProperties.concat(self.renderFile(field, filedProperties[field]))
          } else {
            customFieldProperties = customFieldProperties.concat(self.renderField(field, sub))
          }
        }
      }
      return <View key={index}>{customFieldProperties}</View>
    })
  }

  render() {
    const { customForm, visible } = this.props
    const { mainContainer } = additionalFormDetailList
    if (customForm == undefined) {
      return (
        <View style={[mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>{i18n.t('no_data')}</Text>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <Swiper height={visible ? height - 82 : height - 81} showsButtons={false} loop={false} style={mainContainer} paginationStyle={{ bottom: 10 }}>
          {customForm.custom_field_properties.map((customFieldProperty, index) => {
            const createdAt = moment(customFieldProperty.created_at).format('DD MMMM, YYYY')
            return (
              <View key={index}>
                <Card
                  style={{ paddingTop: 30, paddingLeft: 20, paddingRight: 20 }}
                  title={createdAt}
                  rightButton={this.renderActions(customFieldProperty)}
                >
                  <View key={customFieldProperty.id.toString()} style={{ height: '85%' }}>
                    <ScrollView ref="caseNoteCard">{this.renderFormField(customFieldProperty)}</ScrollView>
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
  const entity = ownProps.type == 'client' ? state.clients.data[ownProps.entityId] : state.families.data[ownProps.entityId]
  const message = ownProps.type == 'client' ? state.clients.message : state.families.message
  const customForm = find(entity.additional_form, { id: ownProps.customFormId })
  return { entity, customForm, visible: true, message }
}

export default connect(mapState)(AdditionalFormDetailList)
