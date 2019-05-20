import React, { Component }                       from 'react'
import i18n                                       from '../../../i18n'
import Icon                                       from 'react-native-vector-icons/MaterialIcons'
import DatePicker                                 from 'react-native-datepicker'
import ImagePicker                                from 'react-native-image-picker'
import SectionedMultiSelect                       from 'react-native-sectioned-multi-select'
import { connect }                                from 'react-redux'
import { Navigation }                             from 'react-native-navigation'
import { MAIN_COLOR }                             from '../../../constants/colors'
import { map, filter, find, forEach }             from 'lodash'
import { customFormStyles }                       from '../../../styles'
import { CheckBox, Divider }                      from 'react-native-elements'
import { options, MAX_SIZE }                      from '../../../constants/option'
import { DocumentPicker, DocumentPickerUtil }     from 'react-native-document-picker'
import { createTrackingForm, updateTrackingForm } from '../../../redux/actions/programStreams'
import {
  formTypes,
  disabledUpload,
  validateCustomForm,
} from '../../../utils/validation'

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
class TrackingForm extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = { field_properties: {}, filesSize: 0 }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_TRACKING') {
      const { programStream, tracking, client, action } = this.props
      const { field_properties } = this.state

      const lastActive = find(programStream.enrollments, { status: 'Active' })
      const client_enrolled_programs_id = lastActive.id
      const fields = action == 'create' ? tracking.fields : tracking.tracking_field
      const validated = validateCustomForm(field_properties, fields)
      if (validated) {
        if (action == 'create') {
          this.props.createTrackingForm(field_properties, tracking, client_enrolled_programs_id, client.id, tracking.id, this.props)
        } else {
          this.props.updateTrackingForm('Tracking', field_properties, tracking, client.id, tracking.client_enrollment_id, tracking.id, this.props)
        }
      }
    }
  }

  componentWillMount() {
    const { tracking, action } = this.props
    let { field_properties } = this.state

    const fields = action == 'create' ? tracking.fields : tracking.tracking_field
    const Values = action == 'create' ? null : tracking.properties

    map(fields, field => {
      if (formTypes.includes(field.type)) {
        if (['checkbox-group', 'multiple', 'select', 'file'].includes(field.type)) {
          field_properties[field.label] = Values != null ? Values[field.label] : []
        } else {
          field_properties[field.label] = Values != null ? Values[field.label] : ''
        }
      }
    })
    this.setState({
      field_properties: field_properties
    })
  }

  updateField(label, updatedValue) {
    const { field_properties } = this.state
    field_properties[label] = updatedValue != 'default' ? updatedValue : ''
    this.setState({
      field_properties: field_properties
    })
  }

  updateMultipleSelect(label, value) {
    let { field_properties } = this.state
    if (field_properties[label].includes(value)) {
      field_properties[label] = filter(field_properties[label], selected_value => {
        return selected_value != value
      })
    } else {
      field_properties[label] = field_properties[label].concat(value)
    }
    this.setState(field_properties)
  }

  listItems(options) {
    return map(options, option => ({ name: option.label, id: option.label }))
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
    let value = data != undefined ? data : ''
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

  renderParagraph(label) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin, { color: '#000' }]}>{label}</Text>
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
    let { field_properties } = this.state
    let filesSize = 0
    const updatedAttachment = []
    forEach(data, (file, index) => {
      if (index != attachment) updatedAttachment.push(file)
      else filesSize -= file.size
    })
    field_properties[label] = updatedAttachment
    this.setState({field_properties, filesSize})
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
        'OSCaR Mobile does not yet support File Upload to Program Stream forms. Please save your form and upload the file on oscarhq.com'
      )
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          this.selectAllFile(label, formField, data)
        } else if (response.didCancel) {
        } else {
          this.handleSelectedFile(response, label, formField, data)
        }
      })
    }
  }

  handleSelectedFile(response, label, formField, data) {
    let { field_properties, filesSize } = this.state
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

      field_properties[label] = formField.multiple != undefined && formField.multiple ? field_properties[label].concat(source) : [source]
      this.setState({ filesSize, field_properties })
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    }
    this.setState({ error: null })
  }

  alertFileTypeNotAllow() {
    if (this.state.error != null) {
      Alert.alert(
        'Warning',
        `Invalid extension for file "${this.state.error}". Only "jpg, png, jpeg, doc, docx, xls, xlsx, pdf" files are supported.`,
        [{ text: 'OK', onPress: () => this.setState({ error: null }) }],
        { cancelable: false }
      )
    }
  }

  render() {
    const { tracking, action } = this.props
    const { field_properties } = this.state

    const fields = action == 'create' ? tracking.fields : tracking.tracking_field
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#fff' }}>
        <View style={customFormStyles.aboutClientContainer}>
          {map(fields, (formField, index) => {
            const fieldType = formField.type
            const label = formField.label
            return (
              <View key={index}>
                {fieldType == 'text' && this.textType(label, field_properties[label], formField)}
                {fieldType == 'number' && this.numberType(label, field_properties[label], formField)}
                {fieldType == 'textarea' && this.textareaType(label, field_properties[label], formField)}
                {fieldType == 'date' && this.datePickerType(label, field_properties[label], formField)}
                {fieldType == 'checkbox-group' && this.checkBoxType(label, formField, field_properties[label])}
                {fieldType == 'radio-group' && this.radioType(label, formField, field_properties[label])}
                {fieldType == 'select' && formField.multiple && this.checkBoxType(label, formField, field_properties[label])}
                {fieldType == 'select' && !formField.multiple && this.selectType(label, formField, field_properties[label])}
                {fieldType == 'file' && this.fileUploader(label, formField, field_properties[label])}
                {fieldType == 'paragraph' && this.renderParagraph(label)}
                {fieldType == 'separateLine' && <Divider style={{ backgroundColor: '#ccc', marginTop: 20 }} />}
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

const mapDispatch = {
  createTrackingForm,
  updateTrackingForm
}

export default connect(
  null,
  mapDispatch
)(TrackingForm)
