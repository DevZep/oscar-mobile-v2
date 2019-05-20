import React, { Component }                                     from 'react'
import i18n                                                     from '../../../i18n'
import Icon                                                     from 'react-native-vector-icons/MaterialIcons'
import moment                                                   from 'moment'
import DatePicker                                               from 'react-native-datepicker'
import ImagePicker                                              from 'react-native-image-picker'
import SectionedMultiSelect                                     from 'react-native-sectioned-multi-select'
import { connect }                                              from 'react-redux'
import { Navigation }                                           from 'react-native-navigation'
import { MAIN_COLOR }                                           from '../../../constants/colors'
import { map, filter, forEach }                                 from 'lodash'
import { customFormStyles }                                     from '../../../styles'
import { CheckBox, Divider }                                    from 'react-native-elements'
import { options, MAX_SIZE }                                    from '../../../constants/option'
import { DocumentPicker, DocumentPickerUtil }                   from 'react-native-document-picker'
import { formTypes, disabledUpload, validateProgramStreamForm } from '../../../utils/validation'
import {
  updateLeaveProgramForm,
  updateEnrollmentForm,
  updateTrackingForm
} from '../../../redux/actions/programStreams'

import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
 } from 'react-native'
class EditForm extends Component {
  constructor(props) {
    super(props)
    const programType = props.type == 'Exit' ? 'exit_date' : 'enrollment_date'

    this.state = {
      field_properties: {},
      filesSize: 0
    }
    Navigation.events().bindComponent(this)
    if (props.type.match(/Exit|Enroll/)) {
      this.state[programType] = props.enrollment[programType]
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'UPDATE_FORM') {
      const { field_properties } = this.state
      const { type, enrollment, programStream, clientEnrolledProgramId } = this.props
      const exit_date = this.state.exit_date != undefined ? this.state.exit_date : undefined
      const enrollment_date = this.state.enrollment_date != undefined ? this.state.enrollment_date : undefined

      validateProgramStreamForm(
        'update',
        type,
        field_properties,
        enrollment,
        programStream,
        clientEnrolledProgramId,
        exit_date,
        enrollment_date,
        this.props
      )
    }
  }

  updateField(label, updatedValue) {
    let { field_properties } = this.state
    field_properties[label] = updatedValue != 'default' ? updatedValue : ''
    this.setState(field_properties)
  }

  updateFormDate(updatedValue) {
    const programType = this.props.type == 'Exit' ? 'exit_date' : 'enrollment_date'
    this.setState({
      [programType]: updatedValue
    })
  }

  updateMultipleSelect(label, value) {
    const { field_properties } = this.state
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

  componentWillMount() {
    const { enrollment, type } = this.props
    let { field_properties } = this.state
    const Values = enrollment.properties
    const Fields =
      this.props.type == 'Tracking'
        ? enrollment.tracking_field
        : this.props.type == 'Enroll'
        ? enrollment.enrollment_field
        : enrollment.leave_program_field
    const Keys = map(Fields, 'label')
    const Types = map(Fields, 'type')

    map(Keys, (field, index) => {
      if (Values[field] != undefined) {
        field_properties[field] = Values[field]
      } else {
        if (formTypes.includes(Types[index])) {
          if (['checkbox-group', 'multiple', 'select'].includes(Types[index])) {
            field_properties[field] = []
          } else if (Types[index] == 'file') {
            field_properties[field] = []
          } else {
            field_properties[field] = ''
          }
        }
      }
    })

    this.setState(field_properties)
  }

  datePickerType(label, data, dateType, formField = {}) {
    const required = formField.required || label == 'Enroll Date' || label == 'Exit Date'
    const value = data != undefined ? data : ''
    const new_date = moment(this.props.enrollment_date, 'YYYY-MM-DD')
      .add(1, 'days')
      .format('YYYY-MM-DD')
    const max_date = moment(new Date())
      .add(1, 'years')
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
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          placeholder={i18n.t('client.select_date')}
          showIcon={false}
          format="YYYY-MM-DD"
          minDate={dateType == 'Exit' ? new_date : '1990-01-01'}
          maxDate={
            this.props.enrollment.status == 'Exited' && dateType == 'Enroll'
              ? moment(this.props.enrollment.leave_program.exit_date)
                  .subtract(1, 'days')
                  .format('YYYY-MM-DD')
              : max_date
          }
          customStyles={{
            dateInput: customFormStyles.datePickerBorder
          }}
          onDateChange={date => (dateType == 'formDate' ? this.updateField(label, date) : this.updateFormDate(date))}
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

  textType(label, data, textType, formField) {
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
          placeholder={label}
          placeholderTextColor="#b7b3b3"
          returnKeyType="next"
          style={textType == 'text' ? customFormStyles.input : customFormStyles.inputTextArea}
          multiline={textType == 'text' ? false : true}
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
      <View style={[customFormStyles.fieldContainer]}>
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

  renderParagraph(label) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin, { color: '#000' }]}>{label}</Text>
      </View>
    )
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

      if (formField.multiple != undefined && formField.multiple) {
        field_properties[label] = [...field_properties[label], source]
      } else {
        let updateLocalfile = []

        const isLocalExited = filter(field_properties[label], attachment => {
          return attachment.uri != undefined
        })

        map(field_properties[label], attachment => {
          if (attachment.uri != undefined) {
            updateLocalfile = [...updateLocalfile, source]
          } else {
            updateLocalfile = [...updateLocalfile, attachment]
          }
          return attachment
        })
        field_properties[label] = isLocalExited.length == 0 ? [...updateLocalfile, source] : updateLocalfile
      }
      this.setState({ filesSize, field_properties })
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
    }
    this.setState({ error: null })
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
          this.selectAllFile(label, formField, data)
        } else if (response.didCancel) {
        } else {
          this.handleSelectedFile(response, label, formField, data)
        }
      })
    }
  }

  _removeAttactment(data, attachmentIndex, label) {
    let { field_properties } = this.state
    let filesSize = 0
    const updatedAttachment = []

    forEach(data, (file, index) => {
      if (index != attachmentIndex) updatedAttachment.push(file)
      else filesSize -= file.size
    })

    field_properties[label] = updatedAttachment
    this.setState({field_properties, filesSize})
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
          if (attachment.name != undefined) {
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
          }
        })}
      </View>
    )
  }

  _renderFormField() {
    const { enrollment, type } = this.props
    const { field_properties } = this.state
    const Fields =
      this.props.type == 'Tracking'
        ? enrollment.tracking_field
        : this.props.type == 'Enroll'
        ? enrollment.enrollment_field
        : enrollment.leave_program_field

    return map(Fields, (formField, index) => {
      const fieldType = formField.type
      const label = formField.label
      return (
        <View key={index}>
          {fieldType == 'text' && this.textType(label, field_properties[label], 'text', formField)}
          {fieldType == 'number' && this.numberType(label, field_properties[label], formField)}
          {fieldType == 'textarea' && this.textType(label, field_properties[label], 'textarea', formField)}
          {fieldType == 'date' && this.datePickerType(label, field_properties[label], 'formDate', formField)}
          {fieldType == 'checkbox-group' && this.checkBoxType(label, formField, field_properties[label])}
          {fieldType == 'radio-group' && this.radioType(label, formField, field_properties[label])}
          {fieldType == 'select' && formField.multiple && this.checkBoxType(label, formField, field_properties[label])}
          {fieldType == 'select' && !formField.multiple && this.selectType(label, formField, field_properties[label])}
          {fieldType == 'paragraph' && this.renderParagraph(label)}
          {fieldType == 'separateLine' && <Divider style={{ backgroundColor: '#ccc', marginTop: 20 }} />}
          {fieldType == 'file' && this._fileUploader(label, formField, field_properties[label])}
        </View>
      )
    })
  }

  render() {
    const { field_properties } = this.state
    const { type } = this.props
    const programType = type == 'Exit' ? 'exit_date' : 'enrollment_date'
    return (
      <ScrollView ref="editEnrollmentForm" style={{ backgroundColor: '#fff' }}>
        <View style={customFormStyles.aboutClientContainer}>
          {type.match(/Exit|Enroll/) && this.datePickerType(`${type} Date`, this.state[programType], type)}
          {this._renderFormField()}
        </View>
      </ScrollView>
    )
  }
}

const mapDispatch = {
  updateLeaveProgramForm,
  updateEnrollmentForm,
  updateTrackingForm
}

export default connect(
  null,
  mapDispatch
)(EditForm)
