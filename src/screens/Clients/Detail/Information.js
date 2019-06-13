import React, { Component }         from 'react'
import Card                         from '../../../components/Card'
import i18n                         from '../../../i18n'
import call                         from 'react-native-phone-call'
import moment                       from 'moment'
import Field                        from '../../../components/Field'
import FastImage                    from 'react-native-fast-image'
import { map, upperCase, find }     from 'lodash'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
export default class ClientInformation extends Component {
  calculateAge = () => {
    const { client } = this.props

    if (!client.date_of_birth) return ''

    const years = moment().diff(client.date_of_birth, 'years')
    const months = moment().diff(client.date_of_birth, 'months') % 12
    return this.pluralize('year', years) + ' ' + this.pluralize('month', months)
  }

  pluralize = (title, unit) => {
    if (unit === 0) return ''
    else if (unit === 1) return unit + ' ' + title
    else return unit + ' ' + title + 's'
  }

  serializeAddress = (field, value) => {
    return value ? `${field} ${value}`.trim() : null
  }

  address = () => {
    const { client, setting, translations } = this.props
    const villageName = client.village && `${client.village.name_en} / ${client.village.name_kh}`
    const communeName = client.commune && `${client.commune.name_en} / ${client.commune.name_kh}`
    const districtName = client.district && client.district.name
    const provinceName = client.current_province && client.current_province.name
    const countryName = setting && upperCase(setting.country_name)
    const house = this.serializeAddress(translations.house_number, client.house_number)
    const street = this.serializeAddress(translations.street_number, client.street_number)
    return [house, street, villageName, communeName, districtName, provinceName, countryName].filter(Boolean).join(', ')
  }

  render() {
    const { client, referralSourceCategories, language, translations } = this.props
    const referralSourceCategory = find(referralSourceCategories, {id: client.referral_source_category_id})
    const referralSourceCategoryName = referralSourceCategory == undefined ? '' : language == 'km' ? referralSourceCategory.name : referralSourceCategory.name_en
    return (
      <View style={styles.container}>
        <Card title={translations.general_info}>
          {client.profile && <FastImage style={styles.profile} source={{ uri: client.profile.uri }} resizeMode="contain" />}
          <Field name={translations.given_name} value={client.given_name} />
          <Field name={translations.family_name} value={client.family_name} />
          <Field name={translations.local_given_name} value={client.local_given_name} />
          <Field name={translations.local_family_name} value={client.local_family_name} />
          <Field name={translations.age} value={this.calculateAge()} />
          <Field name={translations.date_of_birth} value={client.date_of_birth} />
          <Field name={translations.current_province} value={client.current_province == undefined ? '' : client.current_province.name} />
          <Field name={translations.code} value={client.code} />
          <Field name={translations.kid_id} value={client.kid_id} />
          <Field name={translations.donor} value={map(client.donors, 'name').join(', ')} />
          <Field name={translations.address} value={this.address()} />
          <Field name={translations.what3words} value={client.what3words} />
          <Field name={translations.birth_province} value={client.birth_province == undefined ? '' : client.birth_province.name} />
          <Field name={translations.name_of_referee} value={client.name_of_referee} />
          <Field name={translations.time_in_care} value={client.time_in_care} />
          <Field
            name={translations.follow_up_by}
            value={client.followed_up_by == undefined ? '' : client.followed_up_by.first_name + ' ' + client.followed_up_by.last_name}
          />
          <Field name={translations.follow_up_date} value={client.follow_up_date} />
          <Field name={translations.referral_source_category_id} value={referralSourceCategoryName} />
          <Field name={translations.referral_source} value={client.referral_source == undefined ? '' : client.referral_source.name} />
          <Field name={translations.referral_phone}>
            {
              client.referral_phone && (
                <TouchableWithoutFeedback onPress={() => call({ number: client.referral_phone, prompt: false }) }>
                  <Text style={{fontSize: 18, textDecorationLine: 'underline'}}>
                    {client.referral_phone}
                  </Text>
                </TouchableWithoutFeedback>
              )
            }
          </Field>
          <Field name={translations.live_with} value={client.live_with} />
          <Field name={translations.telephone_number}>
            {
              client.telephone_number && (
                <TouchableWithoutFeedback onPress={() => call({ number: client.telephone_number, prompt: false }) }>
                  <Text style={{fontSize: 18, textDecorationLine: 'underline'}}>
                    {client.telephone_number}
                  </Text>
                </TouchableWithoutFeedback>
              )
            }
          </Field>
          <Field name={translations.is_the_client_rated_for_id_poor} value={client.rated_for_id_poor} />
          <Field
            name={translations.received_by}
            value={client.received_by == undefined ? '' : client.received_by.first_name + client.received_by.last_name}
          />
          <Field name={translations.initial_referral_date} value={client.initial_referral_date} />
          <Field name={translations.school_name} value={client.school_name} />
          <Field name={translations.school_grade} value={client.school_grade} />
          <Field name={translations.main_school_contact} value={client.main_school_contact} />
          <Field name={translations.has_been_in_orphanage} value={client.has_been_in_orphanage ? 'Yes' : 'No'} />
          <Field name={translations.has_been_in_government_care} value={client.has_been_in_government_care ? 'Yes' : 'No'} />
          <Field name={translations.relevant_referral_information} value={client.relevant_referral_information} />
          <Field name={translations.case_worker} value={map(client.case_workers, cw => `${cw.first_name} ${cw.last_name}`).join(', ')} />
          <Field name={translations.agencies_involved} value={map(client.agencies, 'name').join(', ')} />
          {client.quantitative_cases.map((qc, index) => {
            return (
              <Field name={qc.quantitative_type} key={index}>
                <View style={styles.qcWrapper}>
                  {qc.client_quantitative_cases.map((cqc, index) => (
                    <View key={index} style={styles.qcLabel}>
                      <Text>{cqc}</Text>
                    </View>
                  ))}
                </View>
              </Field>
            )
          })}
        </Card>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20
  },
  editButton: {
    color: '#fff',
    backgroundColor: '#1c84c6',
    padding: 6,
    paddingLeft: 35,
    paddingRight: 35
  },
  profile: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    marginTop: 15,
    marginBottom: 15
  },
  qcWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  qcLabel: {
    backgroundColor: '#EDEFF1',
    padding: 5,
    paddingLeft: 10,
    marginTop: 5
  }
})
