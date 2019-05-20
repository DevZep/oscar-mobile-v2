import React, { Component }                 from 'react'
import i18n                                 from '../i18n'
import styles                               from '../screens/Clients/Edit/styles'
import Profile                              from './Profile'
import DatePicker                           from 'react-native-datepicker'
import DropdownAlert                        from 'react-native-dropdownalert'
import SectionedMultiSelect                 from 'react-native-sectioned-multi-select'
import { CheckBox }                         from 'react-native-elements'
import { MAIN_COLOR }                       from '../constants/colors'
import { Navigation }                       from 'react-native-navigation'
import { map, forEach, filter }             from 'lodash'
import { schoolGrades, poorIds, genders }   from '../constants/clientOptions'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
export default class ClientForm extends Component {
  constructor(props) {
    super(props)
    this.state = { client: props.client }
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_CLIENT') {
      this.props.updateClientProperty(this.state.client, this.props)
    }
  }

  componentDidMount() {
    const { client } = this.state
    const { quantitativeTypes } = this.props
    let agencyIds = []
    let quantitativeIds = []
    let caseWorkersID = []
    let donorIds = []
    if (client.quantitative_cases.length > 0) {
      if (quantitativeTypes != undefined) {
        map(quantitativeTypes, quantitative_type => {
          map(client.quantitative_cases, c_case => {
            if (c_case.quantitative_type == quantitative_type.name) {
              map(c_case.client_quantitative_cases, client_case => {
                map(quantitative_type.quantitative_cases, quantitative_case => {
                  if (quantitative_case.value == client_case) {
                    quantitativeIds = quantitativeIds.concat(quantitative_case.id)
                  }
                })
              })
            }
          })
        })
      }
    }
    if (client.agencies.length > 0) {
      agencyIds = map(client.agencies, 'id')
    }
    if (client.case_workers.length > 0) {
      caseWorkersID = map(client.case_workers, 'id')
    }
    if (client.donors.length > 0) {
      donorIds = map(client.donors, 'id')
    }
    this.setState(prevState => ({
      client: Object.assign({}, prevState.client, {
        birth_province_id: client.birth_province != null ? client.birth_province.id : '',
        donor_ids: donorIds,
        received_by_id: client.received_by != null ? client.received_by.id : '',
        followed_up_by_id: client.followed_up_by != null ? client.followed_up_by.id : '',
        user_ids: caseWorkersID,
        referral_source_id: client.referral_source != null ? client.referral_source.id : '',
        agency_ids: agencyIds,
        quantitative_case_ids: quantitativeIds,
        province_id: client.current_province != null ? client.current_province.id : '',
        district_id: client.district != null ? client.district.id : '',
        commune_id: client.commune != null ? client.commune.id : '',
        village_id: client.village != null ? client.village.id : ''
      })
    }))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      errors = nextProps.error.join(', ')
      this.refs.dropdown.alertWithType('error', 'Error', errors)
    }
  }

  updateClientState = (key, value) => {
    this.setState(prevState => ({
      client: Object.assign({}, prevState.client, {
        [key]: value
      })
    }))
  }

  listItems(options) {
    return map(options, option => ({ name: option.name, id: option.id }))
  }

  listUserItems(users) {
    return map(users, user => ({ name: `${user.first_name} ${user.last_name}`, id: user.id }))
  }

  listBirthProvinces(birthProvinces) {
    let listBirthProvinces = []
    forEach(birthProvinces, (birthProvince, index) => {
      const provinces = this.listItems(birthProvince.provinces)
      const country = { name: birthProvince.country, id: index, children: provinces }
      listBirthProvinces.push(country)
    })
    return listBirthProvinces
  }

  renderQuantitativeTypes = () => {
    const { quantitativeTypes } = this.props
    const { client } = this.state
    if (quantitativeTypes != undefined) {
      return quantitativeTypes.map((quantitative_type, index) => {
        return (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{quantitative_type.name}</Text>
            <SectionedMultiSelect
              items={map(quantitative_type.quantitative_cases, quantitativeCase => ({ name: quantitativeCase.value, id: quantitativeCase.id }))}
              uniqueKey="id"
              modalWithSafeAreaView
              selectText={i18n.t('select_option')}
              alwaysShowSelectText={true}
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
              onSelectedItemsChange={itemValue => {
                this.updateClientState('quantitative_case_ids', itemValue)
              }}
              selectedItems={client.quantitative_case_ids}
            />
          </View>
        )
      })
    }
  }

  render() {
    const { client } = this.state
    const { users, birthProvinces, provinces, donors, referralSources, communes, villages, quantitativeTypes, agencies, districts } = this.props

    let districtOptions = filter(districts, { province_id: client.province_id })
    let communeOptions = filter(communes, { district_id: client.district_id })
    let villageOptions = filter(villages, { commune_id: client.commune_id })
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainer}>
          <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.given_name')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.given_name')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                onSubmitEditing={() => this.refs.family_name.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('given_name', text)}
                value={client.given_name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.family_name')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.family_name')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='family_name'
                onSubmitEditing={() => this.refs.local_given_name.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('family_name', text)}
                value={client.family_name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.given_name_local')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.given_name_local')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='local_given_name'
                onSubmitEditing={() => this.refs.local_family_name.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('local_given_name', text)}
                value={client.local_given_name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.family_name_local')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.family_name_local')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='local_family_name'
                style={styles.input}
                onChangeText={text => this.updateClientState('local_family_name', text)}
                value={client.local_family_name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.date_of_birth')}</Text>
              <DatePicker
                date={client.date_of_birth}
                style={styles.datePicker}
                mode="date"
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                showIcon={false}
                placeholder={i18n.t('client.select_date')}
                format="YYYY-MM-DD"
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
                onDateChange={date => this.updateClientState('date_of_birth', date)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.birth_province')}</Text>
              <SectionedMultiSelect
                items={this.listBirthProvinces(birthProvinces)}
                uniqueKey="id"
                subKey='children'
                modalWithSafeAreaView
                selectText={i18n.t('select_option')}
                searchPlaceholderText={i18n.t('search')}
                confirmText={i18n.t('confirm')}
                showDropDowns={true}
                single={true}
                hideSearch={false}
                showCancelButton={true}
                readOnlyHeadings={true}
                expandDropDowns={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR },
                  cancelButton: { width: 150 },
                  chipText: { maxWidth: 280 },
                  selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
                }}
                onSelectedItemsChange={itemValue => this.updateClientState('birth_province_id', itemValue[0])}
                selectedItems={[client.birth_province_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.donor')}</Text>
              <SectionedMultiSelect
                items={this.listItems(donors)}
                uniqueKey="id"
                modalWithSafeAreaView
                selectText={i18n.t('select_option')}
                alwaysShowSelectText={true}
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
                onSelectedItemsChange={itemValue => {
                  this.updateClientState('donor_ids', itemValue)
                }}
                selectedItems={client.donor_ids}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.form.gender')}</Text>
              </View>
              <SectionedMultiSelect
                items={genders}
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
                onSelectedItemsChange={itemValue => this.updateClientState('gender', itemValue[0])}
                selectedItems={[client.gender]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.code')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.code')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                onSubmitEditing={() => this.refs.kid_id.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('code', text)}
                value={this.state.client.code}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.kid_id')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.kid_id')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='kid_id'
                style={styles.input}
                onChangeText={text => this.updateClientState('kid_id', text)}
                value={this.state.client.kid_id}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.current_province')}</Text>
              <SectionedMultiSelect
                items={this.listItems(provinces)}
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
                onSelectedItemsChange={itemValue => {
                  this.updateClientState('province_id', itemValue[0]),
                    this.updateClientState('district_id', null),
                    this.updateClientState('commune_id', null),
                    this.updateClientState('village_id', null)
                }}
                selectedItems={[client.province_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.district')}</Text>
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
                onSelectedItemsChange={itemValue => {
                  this.updateClientState('district_id', itemValue[0]),
                    this.updateClientState('commune_id', null),
                    this.updateClientState('village_id', null)
                }}
                selectedItems={[client.district_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.commune')}</Text>
              <SectionedMultiSelect
                items={this.listItems(communeOptions)}
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
                onSelectedItemsChange={itemValue => {
                  this.updateClientState('commune_id', itemValue[0]), this.updateClientState('village_id', null)
                }}
                selectedItems={[client.commune_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.village')}</Text>
              <SectionedMultiSelect
                items={this.listItems(villageOptions)}
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
                onSelectedItemsChange={itemValue => this.updateClientState('village_id', itemValue[0])}
                selectedItems={[client.village_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.street_number')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.street_number')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                onSubmitEditing={() => this.refs.house_number.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('street_number', text)}
                value={client.street_number}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.house_number')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.house_number')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='house_number'
                style={styles.input}
                onChangeText={text => this.updateClientState('house_number', text)}
                value={client.house_number}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.profile')}</Text>
              <Profile onChange={this.updateClientState} image={client.profile} editable />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.what3words')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.what3words')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                style={styles.input}
                onChangeText={text => this.updateClientState('what3words', text)}
                value={client.what3words}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.form.initial_referral_date')}</Text>
              </View>
              <DatePicker
                date={client.initial_referral_date}
                style={styles.datePicker}
                mode="date"
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                placeholder={i18n.t('client.select_date')}
                format="YYYY-MM-DD"
                showIcon={false}
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
                onDateChange={date => this.updateClientState('initial_referral_date', date)}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.form.referral_source')}</Text>
              </View>
              <SectionedMultiSelect
                items={this.listItems(referralSources)}
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
                onSelectedItemsChange={itemValue => this.updateClientState('referral_source_id', itemValue[0])}
                selectedItems={[client.referral_source_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.referral_phone')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.referral_phone')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.updateClientState('referral_phone', text)}
                value={client.referral_phone}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.form.name_of_referee')}</Text>
              </View>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.name_of_referee')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                onSubmitEditing={() => this.refs.who_live_with.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('name_of_referee', text)}
                value={client.name_of_referee}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.who_live_with')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.who_live_with')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='who_live_with'
                onSubmitEditing={() => this.refs.telephone_number.focus()}
                style={styles.input}
                onChangeText={text => this.updateClientState('live_with', text)}
                value={client.live_with}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.telephone_number')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.telephone_number')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                ref='telephone_number'
                keyboardType="numeric"
                style={styles.input}
                onChangeText={text => this.updateClientState('telephone_number', text)}
                value={client.telephone_number}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.rated_for_id_poor')}</Text>
              <SectionedMultiSelect
                items={poorIds}
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
                onSelectedItemsChange={itemValue => this.updateClientState('rated_for_id_poor', itemValue[0])}
                selectedItems={[client.rated_for_id_poor]}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.form.received_by_id')}</Text>
              </View>
              <SectionedMultiSelect
                items={this.listUserItems(users)}
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
                onSelectedItemsChange={itemValue => this.updateClientState('received_by_id', itemValue[0])}
                selectedItems={[client.received_by_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.follow_up_by')}</Text>
              <SectionedMultiSelect
                items={this.listUserItems(users)}
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
                onSelectedItemsChange={itemValue => this.updateClientState('followed_up_by_id', itemValue[0])}
                selectedItems={[client.followed_up_by_id]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.follow_up_date')}</Text>
              <DatePicker
                date={client.follow_up_date}
                style={styles.datePicker}
                mode="date"
                confirmBtnText="Done"
                cancelBtnText="Cancel"
                placeholder={i18n.t('client.select_date')}
                showIcon={false}
                format="YYYY-MM-DD"
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
                onDateChange={date => this.updateClientState('follow_up_date', date)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.school_name')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.school_name')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                style={styles.input}
                onChangeText={text => this.updateClientState('school_name', text)}
                value={client.school_name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.school_grade')}</Text>
              <SectionedMultiSelect
                items={schoolGrades}
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
                onSelectedItemsChange={itemValue => this.updateClientState('school_grade', itemValue[0])}
                selectedItems={[client.school_grade]}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.main_school_contact')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.main_school_contact')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                style={styles.input}
                onChangeText={text => this.updateClientState('main_school_contact', text)}
                value={client.main_school_contact}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.has_been_orphanage')}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={client.has_been_in_orphanage == true ? true : false}
                  onPress={() => this.updateClientState('has_been_in_orphanage', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={client.has_been_in_orphanage == false ? true : false}
                  onPress={() => this.updateClientState('has_been_in_orphanage', false)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.has_goverment_care')}</Text>
              <View style={styles.row}>
                <CheckBox
                  title="Yes"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={client.has_been_in_government_care == true ? true : false}
                  onPress={() => this.updateClientState('has_been_in_government_care', true)}
                />
                <CheckBox
                  title="No"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#009999"
                  style={{ backgroundColor: 'transparent' }}
                  checked={client.has_been_in_government_care == false ? true : false}
                  onPress={() => this.updateClientState('has_been_in_government_care', false)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.relevant_referral_information')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('client.form.relevant_referral_information')}
                placeholderTextColor="#b7b3b3"
                returnKeyType="next"
                style={styles.inputTextArea}
                multiline={true}
                textAlignVertical="top"
                numberOfLines={3}
                onChangeText={text => this.updateClientState('relevant_referral_information', text)}
                value={client.relevant_referral_information}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {color: 'red'}]}>* </Text>
                <Text style={styles.label}>{i18n.t('client.form.case_worker')}</Text>
              </View>
              <SectionedMultiSelect
                items={this.listUserItems(users)}
                uniqueKey="id"
                modalWithSafeAreaView
                selectText={i18n.t('select_option')}
                alwaysShowSelectText={true}
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
                onSelectedItemsChange={itemValue => {
                  this.updateClientState('user_ids', itemValue)
                }}
                selectedItems={client.user_ids}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{i18n.t('client.form.agencies_involved')}</Text>
              <SectionedMultiSelect
                items={this.listItems(agencies)}
                uniqueKey="id"
                modalWithSafeAreaView
                selectText={i18n.t('select_option')}
                alwaysShowSelectText={true}
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
                onSelectedItemsChange={itemValue => {
                  this.updateClientState('agency_ids', itemValue)
                }}
                selectedItems={client.agency_ids}
              />
            </View>
            {this.renderQuantitativeTypes()}
          </KeyboardAvoidingView>
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}
