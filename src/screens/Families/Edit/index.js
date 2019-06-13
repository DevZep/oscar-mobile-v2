import React, { Component }     from 'react'
import { connect }              from 'react-redux'
import { CheckBox }             from 'react-native-elements'
import { Navigation }           from 'react-native-navigation'
import { MAIN_COLOR }           from '../../../constants/colors'
import { updateFamily }         from '../../../redux/actions/families'
import styles                   from './styles'
import i18n                     from '../../../i18n'
import DatePicker               from 'react-native-datepicker'
import DropdownAlert            from 'react-native-dropdownalert'
import SectionedMultiSelect     from 'react-native-sectioned-multi-select'
import {
  map,
  isEmpty,
  assignIn,
  filter
} from 'lodash'
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput
} from 'react-native'
class UserEdit extends Component {
  constructor(props) {
    super(props)
    this.state = { family: this.props.family }
    Navigation.events().bindComponent(this)
  }

  componentDidMount() {
    const { family } = this.state
    this.setState(prevState => ({
      family: Object.assign({}, prevState.family, {
        province_id: family.province != null ? family.province.id : '',
        district_id: family.district != null ? family.district.id : '',
        commune_id: family.commune != null ? family.commune.id : '',
        village_id: family.village != null ? family.village.id : ''
      })
    }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      errors = nextProps.error.join(', ')
      this.refs.dropdown.alertWithType('error', 'Error', errors)
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_FAMILY') {
      if (isEmpty(this.state.family.children)) {
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
    return map(options, option => ({ name: option.name, id: option.id }))
  }

  listClients(options) {
    return map(options, option => ({ name: `${option.family_name} ${option.given_name}`, id: option.id }))
  }

  render() {
    const { provinces, communes, villages, districts, clients, translations } = this.props
    const familyFormTranslations = translations.families.form
    const { family } = this.state
    const clientOptions = assignIn({}, clients, family.clients)
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
    let districtOptions = filter(districts, { province_id: family.province_id })
    let communeOptions = filter(communes, { district_id: family.district_id })
    let villageOptions = filter(villages, { commune_id: family.commune_id })

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainer}>
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.name}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.name}
                placeholder={familyFormTranslations.name}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('name', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.code}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.code}
                placeholder={familyFormTranslations.code}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('code', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.family_type}</Text>
              <SectionedMultiSelect
                items={familyType}
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
                onSelectedItemsChange={family_type => this.setUpdateFamily('family_type', family_type[0])}
                selectedItems={[family.family_type]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.status}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Active"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={family.status == 'Active'}
                  onPress={() => this.setUpdateFamily('status', 'Active')}
                />
                <CheckBox
                  title="Inactive"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={family.status == 'Inactive'}
                  onPress={() => this.setUpdateFamily('status', 'Inactive')}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.case_history}</Text>
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
              <Text style={styles.label}>{familyFormTranslations.address}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={familyFormTranslations.address}
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
              <Text style={styles.label}>{familyFormTranslations.significant_family_member_count}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="number-pad"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('significant_family_member_count', text)}
                value={String(family.significant_family_member_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.female_children_count}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="number-pad"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('female_children_count', text)}
                value={String(family.female_children_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.male_children_count}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="number-pad"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('male_children_count', text)}
                value={String(family.male_children_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.female_adult_count}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder="0"
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="number-pad"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('female_adult_count', text)}
                value={String(family.female_adult_count)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.male_adult_count}</Text>
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
              <Text style={styles.label}>{familyFormTranslations.province}</Text>
              <SectionedMultiSelect
                items={this.listItems(provinces)}
                uniqueKey="id"
                selectText={i18n.t('family.select_province')}
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
              <Text style={styles.label}>{familyFormTranslations.district}</Text>
              <SectionedMultiSelect
                items={this.listItems(districtOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_district')}
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
                onSelectedItemsChange={district => {
                  this.setUpdateFamily('district_id', district[0]), this.setUpdateFamily('commune_id', null), this.setUpdateFamily('village_id', null)
                }}
                selectedItems={[family.district_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.commune}</Text>
              <SectionedMultiSelect
                items={this.listItems(communeOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_commune')}
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
                onSelectedItemsChange={commune => {
                  this.setUpdateFamily('commune_id', commune[0]), this.setUpdateFamily('village_id', null)
                }}
                selectedItems={[family.commune_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.village}</Text>
              <SectionedMultiSelect
                items={this.listItems(villageOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_village')}
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
                onSelectedItemsChange={village => this.setUpdateFamily('village_id', village[0])}
                selectedItems={[family.village_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.street}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.street}
                placeholder={familyFormTranslations.street}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('street', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.house}</Text>
              <TextInput
                autoCapitalize="sentences"
                style={styles.input}
                value={family.house}
                placeholder={familyFormTranslations.house}
                placeholderTextColor="#d5d5d5"
                onChangeText={text => this.setUpdateFamily('house', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.household_income}</Text>
              <TextInput
                placeholder={familyFormTranslations.household_income}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="decimal-pad"
                style={styles.input}
                onChangeText={text => this.setUpdateFamily('household_income', text)}
                value={String(family.household_income)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.dependable_income}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={family.dependable_income}
                  onPress={() => this.setUpdateFamily('dependable_income', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={!family.dependable_income}
                  onPress={() => this.setUpdateFamily('dependable_income', false)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.children}</Text>
              <SectionedMultiSelect
                items={this.listClients(clientOptions)}
                uniqueKey="id"
                selectText={i18n.t('family.select_clients')}
                searchPlaceholderText={i18n.t('search')}
                confirmText={i18n.t('confirm')}
                showDropDowns={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR },
                  cancelButton: { width: 150 },
                  chipText: { maxWidth: 280 },
                  selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
                }}
                onSelectedItemsChange={children => this.setUpdateFamily('children', children)}
                selectedItems={family.children}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{familyFormTranslations.contract_date}</Text>
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
              <Text style={styles.label}>{familyFormTranslations.caregiver_information}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={familyFormTranslations.caregiver_information}
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
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = state => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return {
    provinces: state.provinces.data,
    districts: state.districts.data,
    communes: state.communes.data,
    villages: state.villages.data,
    clients: state.clients.data,
    loading: state.auth.loading,
    error: state.families.error,
    translations
  }
}

const mapDispatch = {
  updateFamily
}

export default connect(
  mapState,
  mapDispatch
)(UserEdit)
