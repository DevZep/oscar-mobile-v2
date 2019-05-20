import React, { Component }                               from 'react'
import i18n                                               from '../i18n'
import Icon                                               from 'react-native-vector-icons/MaterialIcons'
import DatePicker                                         from 'react-native-datepicker'
import ImagePicker                                        from 'react-native-image-picker'
import SectionedMultiSelect                               from 'react-native-sectioned-multi-select'
import { MAIN_COLOR }                                     from '../constants/colors'
import { Navigation }                                     from 'react-native-navigation'
import { customFormStyles }                               from '../styles/customForm'
import { CheckBox, Divider }                              from 'react-native-elements'
import { options, MAX_SIZE }                              from '../constants/option'
import { map, isEmpty, filter }                           from 'lodash'
import { DocumentPicker, DocumentPickerUtil }             from 'react-native-document-picker'
import { validateCustomForm, formTypes, disabledUpload }  from '../utils/validation'
import {
  View,
  Text,
  Alert,
  Image,
  AppState,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
export default class EditAdditionalFormWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entity: props.entity,
      customForm: props.customForm,
      custom_field: props.custom_field,
      fields: {},
      custom_field_property: {},
      nextAppState: AppState.currentState,
      filesSize: 0
    }
    Navigation.events().bindComponent(this)
  }

  componentWillMount() {
    const self = this
    const { customForm, custom_field } = this.state
    let { fields } = this.state

    const values = map(customForm.fields, 'values')
    const fieldsKey = map(customForm.fields, 'label')
    const fieldsType = map(customForm.fields, 'type')
    const filedProperties = custom_field.properties
    map(fieldsKey, (field, index) => {
      if (formTypes.includes(fieldsType[index])) {
        let value = filedProperties[field]
        if (value != undefined && !isEmpty(value)) {
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
      const { entity, fields, customForm, custom_field } = this.state

      const validated = validateCustomForm(fields, customForm.fields)
      if (validated) {
        this.props.editAdditionalForm(fields, entity, custom_field, customForm, this.props)
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
    return map(options, option => ({ name: option.label, id: option.label }))
  }

  updateMultipleSelect(label, value) {
    const { fields } = this.state
    if (fields[label].includes(value)) {
      fields[label] = filter(fields[label], selected_value => {
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

  datePickerType(label, data, formField) {
    const required = formField.required
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
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

  textType(label, data, formField) {
    const required = formField.required
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="next"
          style={customFormStyles.input}
          onChangeText={newData => this.updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  numberType(label, data, formField) {
    const required = formField.required
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="next"
          style={customFormStyles.input}
          keyboardType="numeric"
          onChangeText={newData => this.updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  textareaType(label, data, formField) {
    const required = formField.required
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        <TextInput
          autoCapitalize="sentences"
          placeholder="Relevant Referral Infromation"
          placeholderTextColor="#b7b3b3"
          returnKeyType="next"
          style={customFormStyles.inputTextArea}
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
    const required = formField.required
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        {map(formField.values, (fieldValue, index) => {
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
    const required = formField.required
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        {map(formField.values, (fieldValue, index) => {
          return (
            <View key={index} style={customFormStyles.row}>
              <CheckBox
                title={fieldValue.label}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#009999"
                style={{ backgroundColor: 'transparent' }}
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
    const required = formField.required
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        <SectionedMultiSelect
          items={this.listItems(formField.values)}
          uniqueKey="id"
          modalWithSafeAreaView
          selectText={i18n.t('select_option')}
          searchPlaceholderText={i18n.t('search')}
          confirmText={i18n.t('confirm')}
          showDropDowns={true}
          single={true}
          hideSearch={false}
          showCancelButton={true}
          styles={{
            button: { backgroundColor: MAIN_COLOR },
            cancelButton: { width: 150 },
            chipText: { maxWidth: 280 },
            selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
          }}
          onSelectedItemsChange={itemValue => this.updateField(label, itemValue[0])}
          selectedItems={[value]}
        />
      </View>
    )
  }

  fileUploader(label, formField, data) {
    const required = formField.required
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
          {required && <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>}
          <Text style={[customFormStyles.label, customFormStyles.labelMargin, {flex: 1}]}>{label}</Text>
          <Icon name="add-circle" size={22} color="#fff" onPress={() => this.uploader(label, formField, data)} />
        </View>
        {map(data, (attachment, index) => {
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
    let filesSize = 0
    const updatedAttachment = []

    forEach(data, (file, index) => {
      if (index != attachment) updatedAttachment.push(file)
      else filesSize -= file.size
    })

    fields[label] = updatedAttachment
    this.setState({fields, filesSize})
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
    let { fields, filesSize } = this.state
    const fileSize = response.fileSize / 1024

    filesSize = formField.multiple != undefined && formField.multiple ? filesSize + fileSize : fileSize

    if (filesSize <= MAX_SIZE) {
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

        const isLocalExited = filter(fields[label], attachment => {
          return attachment.uri != undefined
        })

        map(fields[label], attachment => {
          if (attachment.uri != undefined) {
            updateLocalfile = [...updateLocalfile, source]
          } else {
            updateLocalfile = [...updateLocalfile, attachment]
          }
          return attachment
        })
        fields[label] = isLocalExited.length == 0 ? [...updateLocalfile, source] : updateLocalfile
      }

      this.setState({ filesSize, fields })
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    }
    this.setState({ error: null })
  }

  renderFormField = () => {
    const { customForm, fields } = this.state
    return map(customForm.fields, (formField, index) => {
      const fieldType = formField.type
      const label = formField.label
      return (
        <View key={index}>
          {fieldType == 'text' && this.textType(label, fields[label], formField)}
          {fieldType == 'number' && this.numberType(label, fields[label], formField)}
          {fieldType == 'textarea' && this.textareaType(label, fields[label], formField)}
          {fieldType == 'date' && this.datePickerType(label, fields[label], formField)}
          {fieldType == 'checkbox-group' && this.checkBoxType(label, formField, fields[label])}
          {fieldType == 'radio-group' && this.radioType(label, formField, fields[label])}
          {fieldType == 'select' && formField.multiple && this.checkBoxType(label, formField, fields[label])}
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
