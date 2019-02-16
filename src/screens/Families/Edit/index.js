import React, { Component } from 'react'
import { CheckBox } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import DatePicker from 'react-native-datepicker'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import { connect } from 'react-redux'
import _ from 'lodash'
import { updateFamily } from '../../../redux/actions/families'
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
  state = { family: this.props.family }

  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_FAMILY') {
      if (_.isEmpty(this.state.family.children)) {
        this.setUpdateFamily('children', [' '])
      }
      this.props.updateFamily(this.state.family, this.props)
    }
  }

  setUpdateFamily(key, value) {
    this.setState(prevState => ({
      family: Object.assign({}, prevState.family, {
        [key]: value
      })
    }))
  }

  listItems(options) {
    return _.map(options, option => ({ name: option.name, id: option.id }))
  }

  listClients(options) {
    return _.map(options, option => ({ name: `${option.family_name} ${option.given_name}`, id: option.id }))
  }

  render() {
    const { departments, provinces, communes, villages, districts, clients } = this.props
    const { family } = this.state
    const clientOptions = _.assignIn({}, clients, family.clients)
    const status = [{ name: 'Active', id: 'Active' }, { name: 'Inactive', id: 'Inactive' }]
    const familyType = [
      { name: 'Birth Family (Both Parents)', id: 'Birth Family (Both Parents)' },
      { name: 'Birth Family (Only Mother)', id: 'Birth Family (Only Mother)' },
      { name: 'Birth Family (Only Father)', id: 'Birth Family (Only Father)' },
      { name: 'Extended Family / Kinship Care', id: 'Extended Family / Kinship Care' },
      { name: 'Short Term / Emergency Foster Care', id: 'Short Term / Emergency Foster Care' },
      { name: 'Long Term Foster Care', id: 'Long Term Foster Care' },
      { name: 'Domestically Adopted', id: 'Domestically Adopted' },
      { name: 'Child-Headed Household', id: 'Child-Headed Household' },
      { name: 'No Family', id: 'Other' }
    ]
    let districtOptions = _.filter(districts, { province_id: family.province_id })
    let communeOptions = _.filter(communes, { district_id: family.district_id })
    let villageOptions = _.filter(villages, { commune_id: family.commune_id })

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainer}>
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.name')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.name}
                placeholder={i18n.t('family.name')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('name', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.code')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.code}
                placeholder={i18n.t('family.code')}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('code', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.family_type')}</Text>
              <SectionedMultiSelect
                items={familyType}
                uniqueKey="id"
                selectText={i18n.t('family.select_family_type')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={family_type => this.setUpdateFamily('family_type', family_type[0])}
                selectedItems={[family.family_type]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.status')}</Text>
              <SectionedMultiSelect
                items={status}
                uniqueKey="id"
                selectText={i18n.t('family.select_status')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={status => this.setUpdateFamily('status', status[0])}
                selectedItems={[family.status]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.case_history')}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.case_history}
                placeholder={family.case_history}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('case_history', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.address')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('family.address')}
                placeholderTextColor="#b7b3b3"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                blurOnSubmit={false}
                style={[{ height: 80 }, styles.inputTextArea]}
                onChangeText={text => this.setUpdateFamily('address', text)}
                value={family.address}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.significant_family_member_count')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('significant_family_member_count', text)}
                value={String(family.significant_family_member_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.female_children_count')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('female_children_count', text)}
                value={String(family.female_children_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.male_children_count')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('male_children_count', text)}
                value={String(family.male_children_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.female_adult_count')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('female_adult_count', text)}
                value={String(family.female_adult_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.male_adult_count')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('male_adult_count', text)}
                value={String(family.male_adult_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.province')}</Text>
              <SectionedMultiSelect
                items={this.listItems(provinces)}
                uniqueKey="id"
                selectText={i18n.t('family.select_province')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={province => {
                  this.setUpdateFamily('province_id', province[0]),
                    this.setUpdateFamily('district_id', null),
                    this.setUpdateFamily('commune_id', null),
                    this.setUpdateFamily('village_id', null)
                }}
                selectedItems={[family.province_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.district')}</Text>
              <SectionedMultiSelect
                items={this.listItems(districtOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_district')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={district => {
                  this.setUpdateFamily('district_id', district[0]),
                    this.setUpdateFamily('commune_id', null),
                    this.setUpdateFamily('village_id', null)
                }}
                selectedItems={[family.district_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.commune')}</Text>
              <SectionedMultiSelect
                items={this.listItems(communeOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_commune')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={commune => {
                  this.setUpdateFamily('commune_id', commune[0]), this.setUpdateFamily('village_id', null)
                }}
                selectedItems={[family.commune_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.village')}</Text>
              <SectionedMultiSelect
                items={this.listItems(villageOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_village')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={village => this.setUpdateFamily('village_id', village[0])}
                selectedItems={[family.village_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.household_income')}</Text>
              <TextInput
                placeholder={i18n.t('family.household_income')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('household_income', text)}
                value={String(family.household_income)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.dependable_income')}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={!family.dependable_income}
                  onPress={() => this.setUpdateFamily('dependable_income', false)}
                />
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={family.dependable_income}
                  onPress={() => this.setUpdateFamily('dependable_income', true)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.clients')}</Text>
              <SectionedMultiSelect
                items={this.listClients(clientOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_clients')}
                searchPlaceholderText={i18n.t('family.search')}
                confirmText={i18n.t('family.confirm')}
                showDropDowns={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR }
                }}
                onSelectedItemsChange={children => this.setUpdateFamily('children', children)}
                selectedItems={family.children}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.contract_date')}</Text>
              <DatePicker
                date={family.contract_date}
                style={styles.datePicker}
                mode="date"
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                showIcon={false}
                placeholder={i18n.t('family.select_contract_date')}
                format="YYYY-MM-DD"
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
                onDateChange={date => this.setUpdateFamily('contract_date', date)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('family.caregiver_information')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('family.caregiver_information')}
                placeholderTextColor="#b7b3b3"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                blurOnSubmit={false}
                style={[{ height: 80 }, styles.inputTextArea]}
                onChangeText={text => this.setUpdateFamily('caregiver_information', text)}
                value={family.caregiver_information}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }
}

const mapState = state => ({
  provinces: state.provinces.data,
  districts: state.districts.data,
  communes: state.communes.data,
  villages: state.villages.data,
  clients: state.clients.data,
  loading: state.auth.loading
})

const mapDispatch = {
  updateFamily
}

export default connect(
  mapState,
  mapDispatch
)(UserEdit)
