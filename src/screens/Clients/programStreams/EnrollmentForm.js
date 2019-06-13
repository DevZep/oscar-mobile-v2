import React, { Component }                               from 'react'
import i18n                                               from '../../../i18n'
import Icon                                               from 'react-native-vector-icons/MaterialIcons'
import moment                                             from 'moment'
import DatePicker                                         from 'react-native-datepicker'
import ImagePicker                                        from 'react-native-image-picker'
import SectionedMultiSelect                               from 'react-native-sectioned-multi-select'
import { connect }                                        from 'react-redux'
import { Navigation }                                     from 'react-native-navigation'
import { MAIN_COLOR }                                     from '../../../constants/colors'
import { map, filter }                                    from 'lodash'
import { customFormStyles }                               from '../../../styles'
import { CheckBox, Divider }                              from 'react-native-elements'
import { options, MAX_SIZE }                              from '../../../constants/option'
import { createEnrollmentForm }                           from '../../../redux/actions/programStreams'
import { DocumentPicker, DocumentPickerUtil }             from 'react-native-document-picker'
import { validateCustomForm, formTypes, disabledUpload }  from '../../../utils/validation'
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
class EnrollmentForm extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = { enrollment_date: '', fieldProperties: {}, filesSize: 0 }
  }

  componentWillMount() {
    const { programStream } = this.props
    let { fieldProperties } = this.state
    map(programStream.enrollment, field => {
      if (formTypes.includes(field.type)) {
        if (['checkbox-group', 'multiple', 'select'].includes(field.type)) {
          fieldProperties[field.label] = []
        } else if (field.type == 'file') {
          fieldProperties[field.label] = []
        } else {
          let formValue = ''
          fieldProperties[field.label] = formValue
        }
      }
    })
    this.setState(fieldProperties)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_ENROLLMENT') {
      let { programStream, client } = this.props
      const { fieldProperties, enrollment_date } = this.state
      programStream.enrollment_field = programStream.enrollment
      if (enrollment_date != '') {
        const validated = validateCustomForm(fieldProperties, programStream.enrollment_field)
        if (validated) {
          this.props.createEnrollmentForm(fieldProperties, programStream, client.id, enrollment_date, this.props)
        }
      } else {
        Alert.alert('Warning', "Enroll Date can't be blank.")
      }
    }
  }

  updateField(label, updatedValue) {
    const { fieldProperties } = this.state
    fieldProperties[label] = updatedValue != 'default' ? updatedValue : ''
    this.setState(fieldProperties)
  }

  updateMultipleSelect(label, value) {
    let { fieldProperties } = this.state
    if (fieldProperties[label].includes(value)) {
      fieldProperties[label] = filter(fieldProperties[label], selected_value => {
        return selected_value != value
      })
    } else {
      fieldProperties[label] = fieldProperties[label].concat(value)
    }
    this.setState(fieldProperties)
  }

  listItems(options) {
    return map(options, option => ({ name: option.label, id: option.label }))
  }

  datePickerType(label, data, formField = {}) {
    const required = formField.required || label == 'Enroll Date'
    const value = data != undefined ? data : ''
    const minDate = moment(this.state.enrollment_date, 'YYYY-MM-DD')
      .add(1, 'days')
      .format('YYYY-MM-DD')
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
          minDate={label == 'Enroll Date' ? minDate : '1980-01-01'}
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

  enrollementdatePickerType(label, data) {
    const value = data != undefined ? data : ''
    const minDate = moment(this.state.enrollment_date, 'YYYY-MM-DD')
      .add(1, 'days')
      .format('YYYY-MM-DD')
    return (
      <View style={customFormStyles.fieldContainer}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[customFormStyles.label, customFormStyles.labelMargin, {color: 'red'}]}>* </Text>
          <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        </View>
        <DatePicker
          date={value}
          style={customFormStyles.datePicker}
          mode="date"
          minDate={minDate}
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          placeholder={i18n.t('client.select_date')}
          showIcon={false}
          format="YYYY-MM-DD"
          customStyles={{
            dateInput: customFormStyles.datePickerBorder
          }}
          onDateChange={date => this.setState({ enrollment_date: date })}
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
          <Icon name="add-circle" size={22} color="#fff" onPress={() => this._uploader(label, formField, data)} />
        </View>
        {map(data, (attachment, index) => {
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
        })}
      </View>
    )
  }

  removeAttactment(data, attachment, label) {
    let { fieldProperties } = this.state
    let filesSize = 0
    const updatedAttachment = []

    forEach(data, (file, index) => {
      if (index != attachment) updatedAttachment.push(file)
      else filesSize -= file.size
    })
    fieldProperties[label] = updatedAttachment
    this.setState({fieldProperties, filesSize})
  }

  _selectAllFile(label, formField, data) {
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

  _uploader(label, formField, data) {
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
          this._selectAllFile(label, formField, data)
        } else if (response.didCancel) {
        } else {
          this.handleSelectedFile(response, label, formField, data)
        }
      })
    }
  }

  handleSelectedFile(response, label, formField, data) {
    let { fieldProperties, filesSize } = this.state
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

      fieldProperties[label] = formField.multiple != undefined && formField.multiple ? fieldProperties[label].concat(source) : [source]
      this.setState({ filesSize, fieldProperties })
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    }
    this.setState({ error: null })
  }
  render() {
    const { programStream, translations } = this.props
    const { fieldProperties, enrollment_date } = this.state
    const enrollmentDateTranslation = translations.client_enrolled_programs.form.enrollment_date
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#fff' }}>
        <View style={customFormStyles.aboutClientContainer}>
          {this.enrollementdatePickerType(enrollmentDateTranslation, enrollment_date)}
          {map(programStream.enrollment, (formField, index) => {
            const fieldType = formField.type
            const label = formField.label
            return (
              <View key={index}>
                {fieldType == 'text' && this.textType(label, fieldProperties[label], formField)}
                {fieldType == 'number' && this.numberType(label, fieldProperties[label], formField)}
                {fieldType == 'textarea' && this.textareaType(label, fieldProperties[label], formField)}
                {fieldType == 'date' && this.datePickerType(label, fieldProperties[label], formField)}
                {fieldType == 'checkbox-group' && this.checkBoxType(label, formField, fieldProperties[label])}
                {fieldType == 'radio-group' && this.radioType(label, formField, fieldProperties[label])}
                {fieldType == 'select' && formField.multiple && this.checkBoxType(label, formField, fieldProperties[label])}
                {fieldType == 'select' && !formField.multiple && this.selectType(label, formField, fieldProperties[label])}
                {fieldType == 'file' && this.fileUploader(label, formField, fieldProperties[label])}
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

const mapState = (state) => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return { translations }
}

const mapDispatch = {
  createEnrollmentForm
}

export default connect(
  mapState,
  mapDispatch
)(EnrollmentForm)
