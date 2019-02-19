import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, Dimensions, Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'
import Field from './Field'
import Card from './Card'
import _ from 'lodash'
import i18n from '../i18n'
import appIcon from '../utils/Icon'
var moment = require('moment')
const { height } = Dimensions.get('window')
import { connect } from 'react-redux'
import { pushScreen } from '../navigation/config'

class AdditionalFormDetailList extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'ADD_CUSTOM_FORM') {
      const icons = await appIcon()
      pushScreen(this.props.componentId, {
        screen: 'oscar.createCustomForm',
        title: this.props.customForm.form_title,
        props: {
          entity: this.props.entity,
          customForm: this.props.customForm,
          entityDetailComponentId: this.props.componentId,
          type: this.props.type,
          clickForm: 'additionalForm'
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

  deleteAdditionalForm = customForm => {
    const { deleteAdditionalForm, entity } = this.props
    Alert.alert('Warning', 'Are you sure you want to delete?', [
      {
        text: 'OK',
        onPress: () => deleteAdditionalForm(customForm, entity, this.props)
      },
      { text: 'Cancel' }
    ])
  }

  editAdditionalForm = async customFieldProperty => {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.editCustomForm',
      title: 'Edit Additinal Form',
      props: {
        customForm: this.props.customForm,
        custom_field: customFieldProperty,
        entity: this.props.entity,
        type: this.props.type,
        currentComponentId: this.props.componentId
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
      <View key={key} style={styles.fieldContainer}>
        <View>
          <Text style={styles.field}>{key}</Text>
          {files.map((file, index) => {
            let url = file.url
            if (url == undefined) {
              url = file.name
            }
            if (url != undefined) {
              const filename = url.substring(url.lastIndexOf('/') + 1)
              if (filename != 'image-placeholder.png') {
                return (
                  <View key={index} style={styles.multipleFiledContainer}>
                    <Image
                      resizeMode="center"
                      style={styles.thumnail}
                      source={{ uri: file.url != undefined ? url : file.uri }}
                    />
                    <Text style={[styles.fieldData]}>{filename.substring(filename.length - 20, filename.length)}</Text>
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
      <View style={styles.iconWrapper}>
        <TouchableWithoutFeedback onPress={() => this.editAdditionalForm(customFieldProperty)}>
          <View>
            <Icon color="#fff" name="edit" size={25} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.deleteAdditionalForm(customFieldProperty)}>
          <View style={styles.deleteIcon}>
            <Icon color="#fff" name="delete" size={25} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderFormField = customFieldProperty => {
    const self = this
    const { customForm } = this.props
    const fieldsKey = _.map(customForm.fields, 'label')
    const fieldsType = _.map(customForm.fields, 'type')
    const filedProperties = customFieldProperty.properties
    return _.map(fieldsKey, (field, index) => {
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
    const { mainContainer, container } = styles
    if (customForm == undefined) {
      return (
        <View style={[mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>{i18n.t('no_data')}</Text>
        </View>
      )
    }
    return (
      <Swiper
        height={visible ? height - 82 : height - 81}
        showsButtons={false}
        loop={false}
        style={mainContainer}
        paginationStyle={{ bottom: 10 }}
      >
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
    )
  }
}

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
    margin: 20,
    marginBottom: 0,
    elevation: 15,
    height: '12%'
  },
  title: { flex: 1 },
  iconWrapper: { flex: 0.4, flexDirection: 'row' },
  deleteIcon: { marginLeft: 15 },
  mainContainer: {
    height: '95%',
    backgroundColor: '#EDEFF1'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 15,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    margin: 20,
    marginTop: 0
  },
  cardTitleWrapper: {
    padding: 20,
    backgroundColor: '#088'
  },
  cardTitle: {
    color: '#fff'
  },
  fieldContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    borderTopColor: '#EDEFF1'
  },
  field: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#009999'
  },
  fieldData: {
    fontSize: 18
  },
  multipleFiledContainer: {
    flexDirection: 'row',
    backgroundColor: '#dedede',
    borderRadius: 2,
    padding: 4,
    marginBottom: 2
  },
  thumnail: {
    width: 35,
    height: 35,
    marginRight: 12
  }
})

const mapState = (state, ownProps) => {
  const entity =
    ownProps.type == 'client' ? state.clients.data[ownProps.entityId] : state.families.data[ownProps.entityId]

  const customForm = _.find(entity.additional_form, { id: ownProps.customFormId })
  return { entity, customForm, visible: true }
}

export default connect(mapState)(AdditionalFormDetailList)
