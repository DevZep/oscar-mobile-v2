import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'
import { Navigation } from 'react-native-navigation'
import _ from 'lodash'
import Field from './Field'
import appIcon from '../utils/Icon'
var moment = require('moment')
const { height } = Dimensions.get('window')
import { connect } from 'react-redux'

class AdditionalFormList extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'ADD_CUSTOM_FORM') {
      const icons = await appIcon()
      Navigation.push(this.props.componentId, {
        component: {
          name: 'oscar.createCustomForm',
          passProps: {
            family: this.props.family,
            customForm: this.props.customForm,
            familyDetailComponentId: this.props.componentId,
            type: this.props.type,
            clickForm: 'additionalForm'
          },
          options: {
            bottomTabs: {
              visible: false
            },
            topBar: {
              title: {
                text: this.props.customForm.form_title
              },
              backButton: {
                showTitle: false
              },
              rightButtons: [
                {
                  id: 'SAVE_CUSTOM_FORM',
                  icon: icons.save,
                  color: '#fff'
                }
              ]
            }
          }
        }
      })
    }
  }

  redirectListAdditionalForms = () => {
    if (this.props.customForm.custom_field_properties.length == 0) {
      Navigation.popTo(this.props.listAddtionalFormComponentId)
    }
  }

  deleteAdditionalForm = customForm => {
    const { deleteFamilyAdditionalForm, family } = this.props
    Alert.alert('Warning', 'Are you sure you want to delete?', [
      {
        text: 'OK',
        onPress: () => deleteFamilyAdditionalForm(customForm, family, this.redirectListAdditionalForms, this.props)
      },
      { text: 'Cancel' }
    ])
  }

  editAdditionalForm = async customFieldProperty => {
    const icons = await appIcon()
    Navigation.push(this.props.componentId, {
      component: {
        name: 'oscar.editCustomForm',
        passProps: {
          customForm: this.props.customForm,
          custom_field: customFieldProperty,
          family: this.props.family,
          type: this.props.type || '',
          currentComponentId: this.props.componentId
        },
        options: {
          bottomTabs: {
            visible: false
          },
          topBar: {
            title: {
              text: 'Edit Additinal Form'
            },
            backButton: {
              showTitle: false
            },
            rightButtons: [
              {
                id: 'SAVE_CUSTOM_FORM',
                icon: icons.save,
                color: '#fff'
              }
            ]
          }
        }
      }
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
          <Text>No Data</Text>
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
            <View key={customFieldProperty.id} style={mainContainer}>
              <View style={[styles.cardTitleWrapper, styles.titleWrapper]}>
                <Text style={[styles.cardTitle, styles.title]}>{createdAt}</Text>
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
              </View>
              <ScrollView ref="caseNoteCard" style={container}>
                {this.renderFormField(customFieldProperty)}
              </ScrollView>
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
  iconWrapper: { flex: 0.2, flexDirection: 'row' },
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
  const family = state.families.data[ownProps.familyId]
  const customForm = _.find(family.additional_form, { id: ownProps.customFormId })
  return { family, customForm, visible: true }
}

export default connect(mapState)(AdditionalFormList)
