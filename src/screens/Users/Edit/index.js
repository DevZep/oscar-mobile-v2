import React, { Component }       from 'react'
import { map }                    from 'lodash'
import { connect }                from 'react-redux'
import { CheckBox }               from 'react-native-elements'
import { Navigation }             from 'react-native-navigation'
import { updateUser }             from '../../../redux/actions/auth'
import { MAIN_COLOR }             from '../../../constants/colors'
import i18n                       from '../../../i18n'
import styles                     from './styles'
import DatePicker                 from 'react-native-datepicker'
import DropdownAlert              from 'react-native-dropdownalert'
import SectionedMultiSelect       from 'react-native-sectioned-multi-select'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView
} from 'react-native'

class UserEdit extends Component {
  state = { user: this.props.user }

  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_USER') {
      this.props.updateUser(this.state.user, this.props.alertMessage)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.refs.dropdown.alertWithType('error', 'Error', nextProps.error)
    }
  }

  setUpdateUser(key, value) {
    this.setState(prevState => ({
      user: Object.assign({}, prevState.user, {
        [key]: value
      })
    }))
  }

  listItems(options) {
    return map(options, option => ({ name: option.name, id: option.id }))
  }

  render() {
    const { departments, provinces, languages } = this.props
    const { user } = this.state
    const genders = [
      { id: 'male', name: 'Male' },
      { id: 'female', name: 'Female' },
      { id: 'other', name: 'Other' },
      { id: 'prefer not to say', name: 'Prefer not to say' }
    ]
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainer}>
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.first_name}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.first_name}
                placeholder={languages.first_name}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('first_name', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.last_name}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.last_name}
                placeholder={languages.last_name}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('last_name', text.value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>* {languages.gender}</Text>
              <SectionedMultiSelect
                items={this.listItems(genders)}
                uniqueKey="id"
                selectText={i18n.t('user.select_gender')}
                searchPlaceholderText={i18n.t('user.search')}
                confirmText={i18n.t('user.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={gender => this.setUpdateUser('gender', gender[0])}
                selectedItems={[user.gender]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.date_of_birth}</Text>
              <DatePicker
                style={styles.datePicker}
                date={user.date_of_birth}
                mode="date"
                placeholder={i18n.t('client.select_date')}
                placeholderText="#ccc"
                showIcon={false}
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => this.setUpdateUser('date_of_birth', date)}
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.job_title}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.job_title}
                placeholder={languages.job_title}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('job_title', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.department')}</Text>
              {departments != undefined && (
                <SectionedMultiSelect
                  items={this.listItems(departments)}
                  uniqueKey="id"
                  selectText={languages.department}
                  searchPlaceholderText={i18n.t('user.search')}
                  confirmText={i18n.t('user.confirm')}
                  showDropDowns={true}
                  single={true}
                  hideSearch={false}
                  showCancelButton={true}
                  styles={{
                    button: { backgroundColor: MAIN_COLOR }
                  }}
                  onSelectedItemsChange={department_id => this.setUpdateUser('department_id', department_id[0])}
                  selectedItems={[user.department_id]}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.start_date}</Text>
              <DatePicker
                style={styles.datePicker}
                date={user.start_date}
                mode="date"
                placeholder={i18n.t('client.select_date')}
                placeholderText="#ccc"
                showIcon={false}
                format="YYYY-MM-DD"
                minDate="2000-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => this.setUpdateUser('start_date', date)}
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.province}</Text>
              {provinces != undefined && (
                <SectionedMultiSelect
                  items={this.listItems(provinces)}
                  uniqueKey="id"
                  selectText={i18n.t('user.select_province')}
                  searchPlaceholderText={i18n.t('user.search')}
                  confirmText={i18n.t('user.confirm')}
                  showDropDowns={true}
                  single={true}
                  hideSearch={false}
                  showCancelButton={true}
                  styles={{
                    button: { backgroundColor: MAIN_COLOR }
                  }}
                  onSelectedItemsChange={province_id => this.setUpdateUser('province_id', province_id[0])}
                  selectedItems={[user.province_id]}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.mobile}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.mobile}
                placeholder="EX: 010555666"
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('mobile', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>* {languages.email}</Text>
              <TextInput
                autoCapitalize="sentences"
                ref={input => {
                  this.email = input
                }}
                style={styles.input}
                value={user.email}
                placeholder="someone@example.com"
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('email', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>* {languages.current_password}</Text>
              <TextInput
                autoCapitalize="sentences"
                ref={input => {
                  this.current_password = input
                }}
                style={styles.input}
                secureTextEntry={true}
                value={user.current_password}
                placeholder={languages.current_password}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('current_password', text)}
              />
              <Text style={styles.sms}>{languages.current_password_hint}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.password}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                secureTextEntry={true}
                value={user.password}
                placeholder={languages.password}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('password', text)}
              />
              <Text style={styles.sms}>{languages.password_hint}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.password_confirmation}</Text>
              <TextInput
                autoCapitalize="sentences"
                ref={input => {
                  this.password_confirmation = input
                }}
                style={styles.input}
                secureTextEntry={true}
                value={user.password_confirmation}
                placeholder={languages.password_confirmation}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('password_confirmation', text)}
              />
              <Text style={styles.sms}>{languages.password_hint}</Text>
            </View>
            <View style={styles.inputContainer}>

              <Text style={styles.label}>{languages.overdue_summary}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.task_notify == true ? true : false}
                  onPress={() => this.setUpdateUser('task_notify', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.task_notify == false ? true : false}
                  onPress={() => this.setUpdateUser('task_notify', false)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.referral_notification}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.referral_notification == true ? true : false}
                  onPress={() => this.setUpdateUser('referral_notification', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.referral_notification == false ? true : false}
                  onPress={() => this.setUpdateUser('referral_notification', false)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{languages.calendar_integration}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.calendar_integration == true ? true : false}
                  onPress={() => this.setUpdateUser('calendar_integration', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.calendar_integration == false ? true : false}
                  onPress={() => this.setUpdateUser('calendar_integration', false)}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = state => ({
  loading: state.auth.loading,
  error: state.auth.error
})

const mapDispatch = {
  updateUser
}

export default connect(
  mapState,
  mapDispatch
)(UserEdit)
