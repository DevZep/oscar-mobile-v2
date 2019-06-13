import React, { Component }       from 'react'
import { connect }                from 'react-redux'
import { View, ScrollView }       from 'react-native'
import { Navigation }             from 'react-native-navigation'
import { pushScreen }             from '../../../navigation/config'
import { upperCase }              from 'lodash'
import moment                     from 'moment'
import appIcon                    from '../../../utils/Icon'
import styles                     from '../../Clients/Detail/styles'
import Menu                       from '../../Clients/Detail/Menu'
import Card                       from '../../../components/Card'
import Field                      from '../../../components/Field'
import DropdownAlert              from 'react-native-dropdownalert'
class FamilyDetail extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'EDIT_FAMILY') {
      const { family, translations } = this.props
      const icons = await appIcon()
      pushScreen(this.props.componentId, {
        screen: 'oscar.editFamily',
        title: translations.families.edit.edit_family_title,
        props: {
          family,
          familyDetailComponentId: this.props.componentId,
          alertMessage: () => this.alertMessage('Family has been successfully updated.')
        },
        rightButtons: [
          {
            id: 'SAVE_FAMILY',
            icon: icons.save,
            color: '#fff'
          }
        ]
      })
    }
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  navigateToAdditionalForms = (family, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.additionalForms',
      title,
      props: {
        entityId: family.id,
        type: 'family'
      }
    })
  }

  navigateToAddForms = (family, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.addForms',
      title,
      props: {
        entityId: family.id,
        entityDetailComponentId: this.props.componentId,
        type: 'family',
        alertMessage: () => this.alertMessage('Custom Field Properties has been successfully created.')
      }
    })
  }

  serializeAddress = (field, value) => {
    return value ? `${field} ${value}`.trim() : null
  }

  address = (familyDetailTranslations) => {
    const { family, setting } = this.props
    const villageName = family.village && `${family.village.name_en} / ${family.village.name_kh}`
    const communeName = family.commune && `${family.commune.name_en} / ${family.commune.name_kh}`
    const districtName = family.district && family.district.name
    const provinceName = family.province && family.province.name
    const countryName = setting && upperCase(setting.country_name)

    const house = this.serializeAddress(familyDetailTranslations.house, family.house)
    const street = this.serializeAddress(familyDetailTranslations.street, family.street)

    return [house, street, villageName, communeName, districtName, provinceName, countryName].filter(Boolean).join(', ')
  }

  render() {
    const { family, translations } = this.props
    const memberCount = family.female_children_count + family.male_children_count + family.female_adult_count + family.male_adult_count
    const familyDetailTranslations = translations.families.show
    return (
      <View style={{ flex: 1, backgroundColor: '#EDEFF1' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.widgetContainer}>
            <View style={styles.widgetRow}>
              <Menu
                title={familyDetailTranslations.additional_forms}
                value={family.additional_form.length}
                color="#1c84c6"
                onPress={() => this.navigateToAdditionalForms(family, familyDetailTranslations.additional_forms)}
                disabled={family.additional_form.length == 0}
              />
              <Menu
                title={familyDetailTranslations.add_form}
                value={family.add_forms.length}
                color="#1c84c6"
                onPress={() => this.navigateToAddForms(family, familyDetailTranslations.add_form)}
              />
            </View>
          </View>
          <Card style={{ paddingTop: 30, paddingLeft: 20, paddingRight: 20 }} title={familyDetailTranslations.general_info}>
            <Field name={familyDetailTranslations.code} value={family.code} />
            <Field name={familyDetailTranslations.case_history} value={family.case_history} />
            <Field name={familyDetailTranslations.address} value={this.address(familyDetailTranslations)} />
            <Field name={familyDetailTranslations.member_count} value={`${memberCount} People` || '0'} />
            <Field name={familyDetailTranslations.caregiver_information} value={family.caregiver_information} />
            <Field name={familyDetailTranslations.significant_family_member_count} value={family.significant_family_member_count} />
            <Field name={familyDetailTranslations.household_income} value={`$${parseFloat(family.household_income).toFixed(2)}`} />
            <Field name={familyDetailTranslations.dependable_income} value={family.dependable_income == false ? familyDetailTranslations.no : familyDetailTranslations.yes} />
            <Field name={familyDetailTranslations.female_children_count} value={family.female_children_count} />
            <Field name={familyDetailTranslations.male_children_count} value={family.male_children_count} />
            <Field name={familyDetailTranslations.female_adult_count} value={family.female_adult_count} />
            <Field name={familyDetailTranslations.male_adult_count} value={family.male_adult_count} />
            <Field name={familyDetailTranslations.contract_date} value={moment(family.contract_date).format('DD MMMM, YYYY')} />
            <Field name={familyDetailTranslations.family_type} value={family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
            <Field name={familyDetailTranslations.status} value={family.status} />
          </Card>
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return {
    family: state.families.data[ownProps.familyId],
    setting: state.setting.data,
    message: state.families.message,
    translations
  }
}

export default connect(mapState)(FamilyDetail)
