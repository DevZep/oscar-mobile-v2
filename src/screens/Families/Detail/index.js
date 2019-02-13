import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { View, Text, ScrollView } from 'react-native'
import Button from 'apsl-react-native-button'
import Field from '../../../components/Field'
import Card from '../../../components/Card'
import i18n from '../../../i18n'
import { Navigation } from 'react-native-navigation'
import appIcon from '../../../utils/Icon'

export default class FamilyDetail extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'EDIT_FAMILY') {
      const { family } = this.props
      const icons = await appIcon()
      Navigation.push(this.props.componentId, {
        component: {
          name: 'oscar.editFamily',
          passProps: {
            family
          },
          options: {
            bottomTabs: {
              visible: false
            },
            topBar: {
              title: {
                text: 'EDIT FAMILY'
              },
              backButton: {
                showTitle: false
              },
              rightButtons: [
                {
                  id: 'SAVE_FAMILY',
                  icon: icons.save,
                  color: '#fff'
                }
              ]
            }
          }
        }
      })
    }
  }

  render() {
    const { family } = this.props
    const memberCount =
      family.female_children_count + family.male_children_count + family.female_adult_count + family.male_adult_count

    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#EDEFF1' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card title={i18n.t('family.about_family')}>
            <Field name={i18n.t('family.code')} value={family.code} />
            <Field name={i18n.t('family.case_history')} value={family.case_history} />
            <Field name={i18n.t('family.address')} value={family.address} />
            <Field name={i18n.t('family.member_count')} value={`${memberCount} People` || '0'} />
            <Field name={i18n.t('family.caregiver_information')} value={family.caregiver_information} />
            <Field
              name={i18n.t('family.significant_family_member_count')}
              value={family.significant_family_member_count}
            />
            <Field
              name={i18n.t('family.household_income')}
              value={`$${parseFloat(family.household_income).toFixed(2)}`}
            />
            <Field
              name={i18n.t('family.dependable_income')}
              value={family.dependable_income == false ? i18n.t('family.no') : i18n.t('family.yes')}
            />
            <Field name={i18n.t('family.female_children_count')} value={family.female_children_count} />
            <Field name={i18n.t('family.male_children_count')} value={family.male_children_count} />
            <Field name={i18n.t('family.female_adult_count')} value={family.female_adult_count} />
            <Field name={i18n.t('family.male_adult_count')} value={family.male_adult_count} />
            <Field name={i18n.t('family.contract_date')} value={moment(family.contract_date).format('DD MMMM, YYYY')} />
            <Field name={i18n.t('family.province')} value={family.province != null ? family.province.name : ''} />
            <Field
              name={i18n.t('family.family_type')}
              value={family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            />
          </Card>
        </ScrollView>
      </View>
    )
  }
}
