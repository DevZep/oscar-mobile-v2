import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation'
import _ from 'lodash'
import Field from '../../components/Field'
import { connect } from 'react-redux'
import { pushScreen } from '../../navigation/config'
import { fetchProvinces } from '../../redux/actions/provinces'
import { fetchDepartments } from '../../redux/actions/departments'
import { fetchUser } from '../../redux/actions/users'
import { logoutUser } from '../../redux/actions/auth'
import { styles } from './styles'
import i18n from '../../i18n'
import appIcon from '../../utils/Icon'
const color = '#18a689'

class User extends Component {
  constructor(props) {
    super(props)
    this.props.fetchProvinces()
    this.props.fetchDepartments()
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'TRANSLATION') {
      pushScreen(this.props.componentId, {
        screen: 'oscar.language',
        title: i18n.t('language.languages')
      })
    } else if (buttonId === 'EDIT_USER') {
      const { departments, provinces, user } = this.props
      const icons = await appIcon()

      Navigation.push(this.props.componentId, {
        component: {
          name: 'oscar.editUser',
          passProps: {
            departments: departments,
            provinces: provinces,
            user: user
          },
          options: {
            bottomTabs: {
              visible: false
            },
            topBar: {
              title: {
                text: i18n.t('user.edit_title')
              },
              backButton: {
                showTitle: false
              },
              rightButtons: [
                {
                  id: 'SAVE_USER',
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
    const { provinces, departments, user, loading } = this.props
    const department = departments && user.department_id ? _.find(departments, { id: user.department_id }).name : ''
    const province = provinces && user.province_id ? _.find(provinces, { id: user.province_id }).name : ''
    return (
      <View style={styles.container}>
        <View style={styles.aboutFamily}>
          <Text style={styles.aboutFamilyText}>{i18n.t('user.about_user')}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.contentsContainer} showsVerticalScrollIndicator={false}>
          <Field name={i18n.t('user.first_name')} value={user.first_name} />
          <Field name={i18n.t('user.last_name')} value={user.last_name} />
          <Field name={i18n.t('user.gender')} value={_.capitalize(user.gender)} />
          <Field name={i18n.t('user.job_title')} value={user.job_title} />
          <Field name={i18n.t('user.department')} value={department} />
          <Field name={i18n.t('user.mobile')} value={user.mobile} />
          <Field name={i18n.t('user.email')} value={user.email} />
          <Field name={i18n.t('user.dob')} value={user.date_of_birth} />
          <Field name={i18n.t('user.start_date')} value={user.start_date} />
          <Field name={i18n.t('user.province')} value={province} />
        </ScrollView>
        <Button
          style={styles.logoutButton}
          textStyle={styles.buttonTitle}
          onPress={() => this.props.logoutUser()}
          isLoading={loading}
          isDisabled={loading}
        >
          {i18n.t('user.log_out')}
        </Button>
      </View>
    )
  }
}

const mapState = state => ({
  user: state.auth.data,
  loading: state.auth.loading,
  departments: state.departments.data.departments,
  provinces: state.provinces.data.provinces
})

const mapDispatch = {
  fetchProvinces,
  fetchDepartments,
  logoutUser
}

export default connect(
  mapState,
  mapDispatch
)(User)
