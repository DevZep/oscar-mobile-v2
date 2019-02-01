import React, { Component } from 'react'
import { CheckBox } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import DatePicker from 'react-native-datepicker'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import { connect } from 'react-redux'
import _ from 'lodash'
import { updateUser } from '../../../redux/actions/auth'
import { MAIN_COLOR } from '../../../constants/colors'
import styles from './styles'
import i18n from '../../../i18n'
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  StyleSheet
} from 'react-native'

class UserEdit extends Component {
  state = { user: this.props.user }

  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_USER') {
      this.props.updateUser(this.state.user)
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
    return _.map(options, option => ({ name: option.name, id: option.id }))
  }

  render() {
    const { departments, provinces } = this.props
    const { user } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainer}>
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.first_name')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.first_name}
                placeholder={i18n.t('user.first_name')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('first_name', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.last_name')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.last_name}
                placeholder={i18n.t('user.last_name')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('last_name', text.value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.gender')}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Male"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.gender == 'male' ? true : false}
                  onPress={() => this.setUpdateUser('gender', 'male')}
                />
                <CheckBox
                  title="Female"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.gender == 'female' ? true : false}
                  onPress={() => this.setUpdateUser('gender', 'female')}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.dob')}</Text>
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
              <Text style={styles.label}>{i18n.t('user.job_title')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={user.job_title}
                placeholder={i18n.t('user.job_title')}
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
                  selectText={i18n.t('user.select_department')}
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
              <Text style={styles.label}>{i18n.t('user.start_date')}</Text>
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
              <Text style={styles.label}>{i18n.t('user.province')}</Text>
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
              <Text style={styles.label}>{i18n.t('user.mobile')}</Text>
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
              <Text style={styles.label}>* {i18n.t('user.email')}</Text>
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
              <Text style={styles.label}>* {i18n.t('user.current_password')}</Text>
              <TextInput
                autoCapitalize="sentences"
                ref={input => {
                  this.current_password = input
                }}
                style={styles.input}
                secureTextEntry={true}
                value={user.current_password}
                placeholder={i18n.t('user.current_password')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('current_password', text)}
              />
              <Text style={styles.sms}>{i18n.t('user.current_password_label')}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.password')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                secureTextEntry={true}
                value={user.password}
                placeholder={i18n.t('user.password')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('password', text)}
              />
              <Text style={styles.sms}>{i18n.t('user.password_label')}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.confirm_password')}</Text>
              <TextInput
                autoCapitalize="sentences"
                ref={input => {
                  this.password_confirmation = input
                }}
                style={styles.input}
                secureTextEntry={true}
                value={user.password_confirmation}
                placeholder={i18n.t('user.confirm_password')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateUser('password_confirmation', text)}
              />
              <Text style={styles.sms}>{i18n.t('user.confirm_password_label')}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.overdue_summary')}</Text>
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
              <Text style={styles.label}>{i18n.t('user.staff_report')}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.staff_performance_notification == true ? true : false}
                  onPress={() => this.setUpdateUser('staff_performance_notification', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  containerStyle={styles.checkbox}
                  checked={user.staff_performance_notification == false ? true : false}
                  onPress={() => this.setUpdateUser('staff_performance_notification', false)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('user.calendar')}</Text>
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
      </View>
    )
  }
}

const mapState = state => ({
  loading: state.auth.loading
})

const mapDispatch = {
  updateUser
}

export default connect(
  mapState,
  mapDispatch
)(UserEdit)
