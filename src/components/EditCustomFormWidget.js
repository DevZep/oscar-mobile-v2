import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Picker,
  Alert,
  AppState,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import { CheckBox, Divider } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import ImagePicker from 'react-native-image-picker'

import { options, MAX_SIZE } from '../constants/option.js'
import { MAIN_COLOR } from '../constants/colors'
import i18n from '../i18n'
import { Navigation } from 'react-native-navigation'
import { customFormStyles } from '../styls'

import { validateCustomForm, validateAdditonalForm, formTypes, disabledUpload } from '../utils/validation'

var moment = require('moment')

export default class EditAdditionalFormWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      client: props.client,
      family: props.family,
      customForm: props.customForm,
      custom_field: props.custom_field,
      fields: {},
      custom_field_property: {},
      nextAppState: AppState.currentState,
      fileSize: 0
    }
    Navigation.events().bindComponent(this)
  }

  componentWillMount() {
    const self = this
    const { customForm, custom_field } = this.state
    let { fields } = this.state

    const values = _.map(customForm.fields, 'values')
    const fieldsKey = _.map(customForm.fields, 'label')
    const fieldsType = _.map(customForm.fields, 'type')
    const filedProperties = custom_field.properties
    _.map(fieldsKey, (field, index) => {
      if (formTypes.includes(fieldsType[index])) {
        let value = filedProperties[field]
        if (value != undefined && !_.isEmpty(value)) {
          fields[fieldsKey[index]] = filedProperties[field]
        } else {
          if (values[index] != undefined) {
            if (typeof values[index] == 'object') {
              if (fieldsType[index] == 'select') {
                value = []
              }
            } else {
              value = ''
            }
            fields[fieldsKey[index]] = fieldsType[index].match(/checkbox-group|file|select/) ? [] : value
          } else {
            if (fieldsType[index].match(/checkbox-group|file|select/)) {
              fields[fieldsKey[index]] = []
            } else {
              fields[fieldsKey[index]] = ''
            }
          }
        }
        self.setState({
          fields,
          custom_field_property: filedProperties
        })
      }
    })
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_CUSTOM_FORM') {
      const { family, client, fields, customForm, custom_field_property, custom_field } = this.state
      const { type } = this.props

      const validated = validateCustomForm(fields, customForm.fields)
      if (validated) {
        if (type == undefined) {
          this.props.editAdditionalForm(fields, client, custom_field, customForm, this.props)
        } else if (type != undefined && type == 'family') {
          this.props.editFamilyAdditionalForm(fields, family, custom_field, customForm, this.props)
        }
      }
    }
  }

  updateField(label, updatedValue) {
    const { fields } = this.state
    fields[label] = updatedValue != 'default' ? updatedValue : ''
    this.setState({
      fields: fields
    })
  }

  listItems(options) {
    return _.map(options, option => ({ name: option.label, id: option.label }))
  }

  updateMultipleSelect(label, value) {
    const { fields } = this.state
    if (fields[label].includes(value)) {
      fields[label] = _.filter(fields[label], selected_value => {
        return selected_value != value
      })
    } else {
      fields[label] = fields[label].concat(value)
    }

    this.setState({
      fields: fields
    })
  }

  renderParagraph(label) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin, { color: '#000' }]}>{label}</Text>
      </View>
    )
  }

  datePickerType(label, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <DatePicker
          date={value}
          style={customFormStyles.datePicker}
          mode="date"
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          placeholder={i18n.t('client.select_date')}
          showIcon={false}
          format="YYYY-MM-DD"
          customStyles={{
            dateInput: customFormStyles.datePickerBorder
          }}
          onDateChange={date => this.updateField(label, date)}
        />
      </View>
    )
  }

  textType(label, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="next"
          style={customFormStyles.input}
          underlineColorAndroid="#009999"
          onChangeText={newData => this.updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  numberType(label, data) {
    let value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="next"
          style={customFormStyles.input}
          underlineColorAndroid="#009999"
          keyboardType="numeric"
          onChangeText={newData => this.updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  textareaType(label, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <TextInput
          autoCapitalize="sentences"
          placeholder="Relevant Referral Infromation"
          placeholderTextColor="#b7b3b3"
          returnKeyType="next"
          style={customFormStyles.inputTextArea}
          underlineColorAndroid="transparent"
          multiline={true}
          textAlignVertical="top"
          numberOfLines={3}
          onChangeText={newData => this.updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  checkBoxType(label, formField, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={[customFormStyles.fieldContainer]}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        {_.map(formField.values, (fieldValue, index) => {
          return (
            <View key={index} style={customFormStyles.row}>
              <CheckBox
                title={fieldValue.label}
                checkedIcon="check-square-o"
                uncheckedIcon="square-o"
                checkedColor="#009999"
                style={customFormStyles.checkBox}
                onPress={() => this.updateMultipleSelect(label, fieldValue.label)}
                checked={value.includes(fieldValue.label) ? true : false}
              />
            </View>
          )
        })}
      </View>
    )
  }

  radioType(label, formField, data) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        {_.map(formField.values, (fieldValue, index) => {
          return (
            <View key={index} style={customFormStyles.row}>
              <CheckBox
                title={fieldValue.label}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#009999"
                style={customFormStyles.checkBox}
                onPress={() => this.updateField(label, fieldValue.label)}
                checked={data == fieldValue.label ? true : false}
              />
            </View>
          )
        })}
      </View>
    )
  }

  selectType(label, formField, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <SectionedMultiSelect
          items={this.listItems(formField.values)}
          uniqueKey="id"
          selectText={i18n.t('family.select_family_type')}
          searchPlaceholderText={i18n.t('family.search')}
          confirmText={i18n.t('family.confirm')}
          showDropDowns={true}
          single={true}
          hideSearch={false}
          showCancelButton={true}
          customFormStyles={{
            button: { backgroundColor: MAIN_COLOR }
          }}
          onSelectedItemsChange={itemValue => this.updateField(label, itemValue[0])}
          selectedItems={[value]}
        />
      </View>
    )
  }

  fileUploader(label, formField, data) {
    return (
      <View style={[customFormStyles.fieldContainer, { marginTop: 10 }]}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dedede',
            alignItems: 'center',
            padding: 4
          }}
        >
          <Text style={[customFormStyles.label, customFormStyles.labelMargin, { flex: 1 }]}>{label}</Text>
          <Icon name="add-circle" size={22} color="#fff" onPress={() => this.uploader(label, formField, data)} />
        </View>
        {_.map(data, (attachment, index) => {
          if (attachment.name != undefined) {
            const name = attachment.name.substring(0, 16)
            return (
              <View key={index} style={customFormStyles.attachmentWrapper}>
                <Image style={{ width: 40, height: 40 }} source={{ uri: attachment.uri }} />
                <Text style={customFormStyles.listAttachments}>{name}...</Text>
                <TouchableWithoutFeedback onPress={() => this.removeAttactment(data, index, label)}>
                  <View style={customFormStyles.deleteAttactmentWrapper}>
                    <Icon color="#fff" name="delete" size={25} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )
          }
        })}
      </View>
    )
  }

  removeAttactment(data, attachment, label) {
    let { fields } = this.state
    const updatedAttachment = _.filter(data, (file, index) => {
      return index != attachment
    })

    fields[label] = updatedAttachment
    this.setState(fields)
  }

  selectAllFile(label, formField, data) {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (error === null && res.uri != null) {
          let type = res.fileName.substring(res.fileName.lastIndexOf('.') + 1)
          if ('jpg jpeg png doc docx xls xlsx pdf'.includes(type)) {
            this.handleSelectedFile(res, label, formField, data)
          } else {
            this.setState({ error: res.fileName })
          }
        }
      }
    )
  }

  uploader(label, formField, data) {
    if (disabledUpload()) {
      Alert.alert(
        'Warning',
        'OSCaR Mobile does not yet support File upload to custom forms. Please save your form and upload the file on oscarhq.com'
      )
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          this.selectAllFile(label, formField, data)
        } else {
          this.handleSelectedFile(response, label, formField, data)
        }
      })
    }
  }

  handleSelectedFile(response, label, formField, data) {
    let { fields } = this.state
    const fileSize = response.fileSize

    if (this.state.fileSize + fileSize / 1024 <= MAX_SIZE) {
      const filePath = response.path != undefined ? `file://${response.path}` : response.uri
      const source = {
        path: filePath,
        uri: response.uri,
        name: response.fileName,
        type: response.type,
        size: fileSize / 1024
      }
      if (formField.multiple != undefined && formField.multiple) {
        fields[label] = [...fields[label], source]
      } else {
        let updateLocalfile = []

        const isLocalExited = _.filter(fields[label], attachment => {
          return attachment.uri != undefined
        })

        _.map(fields[label], attachment => {
          if (attachment.uri != undefined) {
            updateLocalfile = [...updateLocalfile, source]
          } else {
            updateLocalfile = [...updateLocalfile, attachment]
          }
          return attachment
        })
        fields[label] = isLocalExited.length == 0 ? [...updateLocalfile, source] : updateLocalfile
      }

      this.setState({ fileSize: this.state.fileSize + fileSize / 1024, fields: fields })
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 5MB upload per request.')
    }
    this.setState({ error: null })
  }

  renderFormField = () => {
    const self = this
    const { customForm, fields } = this.state
    return _.map(customForm.fields, (formField, index) => {
      const fieldType = formField.type
      const label = formField.label
      return (
        <View key={index}>
          {fieldType == 'text' && this.textType(label, fields[label])}
          {fieldType == 'number' && this.numberType(label, fields[label])}
          {fieldType == 'textarea' && this.textareaType(label, fields[label])}
          {fieldType == 'date' && this.datePickerType(label, fields[label])}
          {fieldType == 'checkbox-group' && this.checkBoxType(label, formField, fields[label])}
          {fieldType == 'radio-group' && this.radioType(label, formField, fields[label])}
          {fieldType == 'select' && formField.multiple && this._checkBoxType(label, formField, fields[label])}
          {fieldType == 'select' && !formField.multiple && this.selectType(label, formField, fields[label])}
          {fieldType == 'file' && this.fileUploader(label, formField, fields[label])}
          {fieldType == 'paragraph' && this.renderParagraph(label)}
          {fieldType == 'separateLine' && <Divider style={{ backgroundColor: '#ccc', marginTop: 20 }} />}
        </View>
      )
    })
  }

  render() {
    return (
      <ScrollView ref="formCard" style={{ backgroundColor: '#fff' }}>
        <View style={customFormStyles.aboutClientContainer}>{this.renderFormField()}</View>
      </ScrollView>
    )
  }
}
