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
import { filter, map, forEach }                           from 'lodash'
import { customFormStyles }                               from '../../../styles'
import { CheckBox, Divider }                              from 'react-native-elements'
import { options, MAX_SIZE }                              from '../../../constants/option'
import { DocumentPicker, DocumentPickerUtil }             from 'react-native-document-picker'
import { validateCustomForm, formTypes, disabledUpload }  from '../../../utils/validation'
import { createLeaveProgramForm }                         from '../../../redux/actions/programStreams'
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'

class ExitForm extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = { exit_date: '', field_properties: {}, filesSize: 0, enrollment_date: '' }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_EXIT_FORM') {
      const { programStream, client } = this.props
      const { field_properties, exit_date } = this.state

      let lastActives = filter(programStream.enrollments, enrollment => {
        return enrollment.status == 'Active'
      })

      let lastActiveEnrollment = JSON.parse(JSON.stringify(lastActives[0]))
      lastActiveEnrollment['leave_program_field'] = programStream.exit_program

      if (exit_date != '') {
        const validated = validateCustomForm(field_properties, lastActiveEnrollment.leave_program_field)
        if (validated) {
          this.props.createLeaveProgramForm(field_properties, lastActiveEnrollment, lastActiveEnrollment.id, client.id, exit_date, this.props)
        }
      } else {
        Alert.alert('Warning', "Exit date can't be blank.")
      }
    }
  }

  componentWillMount() {
    const { programStream } = this.props
    let { field_properties } = this.state
    let lastActives = filter(programStream.enrollments, enrollment => {
      return enrollment.status == 'Active'
    })

    let lastActiveEnrollment = JSON.parse(JSON.stringify(lastActives[0]))

    map(programStream.exit_program, field => {
      if (formTypes.includes(field.type)) {
        if (['checkbox-group', 'multiple', 'select'].includes(field.type)) {
          field_properties[field.label] = []
        } else if (field.type == 'file') {
          field_properties[field.label] = []
        } else {
          let formValue = ''
          field_properties[field.label] = formValue
        }
      }
    })
    this.setState({
      field_properties: field_properties,
      enrollment_date: lastActiveEnrollment.enrollment_date
    })
  }

  _updateField(label, updatedValue) {
    const { field_properties } = this.state
    field_properties[label] = updatedValue != 'default' ? updatedValue : ''
    this.setState({
      field_properties: field_properties
    })
  }

  _updateMultipleSelect(label, value) {
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

  _datePickerType(label, data, formField = {}) {
    const required = formField.required || label == 'Exit Date'
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
          minDate={label == 'Exit Date' ? minDate : '1980-01-01'}
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          placeholder={i18n.t('client.select_date')}
          showIcon={false}
          format="YYYY-MM-DD"
          customStyles={{
            dateInput: customFormStyles.datePickerBorder
          }}
          onDateChange={date => (label == 'Exit Date' ? this.setState({ exit_date: date }) : this._updateField(label, date))}
        />
      </View>
    )
  }

  exitDatePickerType(label, data) {
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
          minDate={label == 'Exit Date' ? minDate : '1980-01-01'}
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          placeholder={i18n.t('client.select_date')}
          showIcon={false}
          format="YYYY-MM-DD"
          customStyles={{
            dateInput: customFormStyles.datePickerBorder
          }}
          onDateChange={date => this.setState({ exit_date: date })}
        />
      </View>
    )
  }

  _textType(label, data, formField) {
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
          onChangeText={newData => this._updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  _numberType(label, data, formField) {
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
          onChangeText={newData => this._updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  _textareaType(label, data, formField) {
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
          onChangeText={newData => this._updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  _checkBoxType(label, formField, data) {
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
                onPress={() => this._updateMultipleSelect(label, fieldValue.label)}
                checked={value.includes(fieldValue.label) ? true : false}
              />
            </View>
          )
        })}
      </View>
    )
  }

  _radioType(label, formField, data) {
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
                onPress={() => this._updateField(label, fieldValue.label)}
                checked={data == fieldValue.label ? true : false}
              />
            </View>
          )
        })}
      </View>
    )
  }

  _renderParagraph(label) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin, { color: '#000' }]}>{label}</Text>
      </View>
    )
  }

  _selectType(label, formField, data) {
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
          onSelectedItemsChange={itemValue => this._updateField(label, itemValue[0])}
          selectedItems={[value]}
        />
      </View>
    )
  }

  _fileUploader(label, formField, data) {
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
              <TouchableWithoutFeedback onPress={() => this._removeAttactment(data, index, label)}>
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

  _removeAttactment(data, attachment, label) {
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

  _alertFileTypeNotAllow() {
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
    const { programStream, translations } = this.props
    const { field_properties, exit_date } = this.state
    const leaveProgramTranslations = translations.leave_enrolled_programs
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#fff' }}>
        <View style={customFormStyles.aboutClientContainer}>
          {this.exitDatePickerType(leaveProgramTranslations.form.exit_date, exit_date)}
          {map(programStream.exit_program, (formField, index) => {
            const fieldType = formField.type
            const label = formField.label
            return (
              <View key={index}>
                {fieldType == 'text' && this._textType(label, field_properties[label], formField)}
                {fieldType == 'number' && this._numberType(label, field_properties[label], formField)}
                {fieldType == 'textarea' && this._textareaType(label, field_properties[label], formField)}
                {fieldType == 'date' && this._datePickerType(label, field_properties[label], formField)}
                {fieldType == 'checkbox-group' && this._checkBoxType(label, formField, field_properties[label])}
                {fieldType == 'radio-group' && this._radioType(label, formField, field_properties[label])}
                {fieldType == 'select' && formField.multiple && this._checkBoxType(label, formField, field_properties[label])}
                {fieldType == 'select' && !formField.multiple && this._selectType(label, formField, field_properties[label])}
                {fieldType == 'file' && this._fileUploader(label, formField, field_properties[label])}
                {fieldType == 'paragraph' && this._renderParagraph(label)}
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
  createLeaveProgramForm
}

export default connect(
  mapState,
  mapDispatch
)(ExitForm)
