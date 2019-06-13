import React, { Component }                 from 'react'
import FlatList                             from '../../components/FlatList'
import { View, Text, ActivityIndicator }    from 'react-native'
import { connect }                          from 'react-redux'
import { pushScreen }                       from '../../navigation/config'
import { isEmpty }                          from 'lodash'
import i18n                                 from '../../i18n'
import styles                               from './styles'
import appIcon                              from '../../utils/Icon'
import {
  fetchFamilies,
  requestFamiliesSuccess
} from '../../redux/actions/families'

class Families extends Component {
  componentDidMount() {
    this.props.fetchFamilies()
  }

  subItems = family => {
    const memberCountTranslation = this.props.translations.families.form.member_count
    const clientsCount = family.clients.length
    const familyType = family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

    return [familyType, `${clientsCount} ${memberCountTranslation}`]
  }

  onPress = async family => {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.familyDetail',
      title: family.name,
      props: {
        familyId: family.id
      },
      rightButtons: [
        {
          id: 'EDIT_FAMILY',
          icon: icons.edit,
          color: '#fff'
        }
      ]
    })
  }

  render() {
    const { families, loading, hasInternet } = this.props

    if (loading) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            flexDirection: 'row'
          }}
        >
          <ActivityIndicator color="#009999" size="large" />
          <Text style={{ fontSize: 16, marginLeft: 8 }}>Loading...</Text>
        </View>
      )
    }

    if (isEmpty(families)) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{i18n.t('no_data')}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={families}
          title={({ name }) => name || '(No Name)'}
          subItems={this.subItems}
          onPress={this.onPress}
          refreshing={loading}
          onRefresh={() => hasInternet && this.props.fetchFamilies()}
        />
      </View>
    )
  }
}

const mapState = state => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return {
    families: state.families.data,
    loading: state.families.loading,
    hasInternet: state.internet.hasInternet,
    translations
  }
}

const mapDispatch = {
  fetchFamilies,
  requestFamiliesSuccess
}

export default connect(
  mapState,
  mapDispatch
)(Families)
