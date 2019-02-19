import React, { Component } from 'react'
import FlatList from '../../components/FlatList'
import { Navigation } from 'react-native-navigation'
import { ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { pushScreen } from '../../navigation/config'
import { fetchFamilies, requestFamiliesSuccess } from '../../redux/actions/families'
import i18n from '../../i18n'
import styles from './styles'
import appIcon from '../../utils/Icon'

class Families extends Component {
  componentDidMount() {
    this.props.fetchFamilies()
  }

  subItems = family => {
    const clientsCount = family.clients.length
    const familyType = family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

    return [familyType, `${clientsCount} ${i18n.t('family.member_count')}`]
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
    if (this.props.loading)
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={this.props.families}
          title={({ name }) => name || '(No Name)'}
          subItems={this.subItems}
          onPress={this.onPress}
        />
      </ScrollView>
    )
  }
}

const mapState = state => ({
  families: state.families.data,
  loading: state.families.loading
})

const mapDispatch = {
  fetchFamilies,
  requestFamiliesSuccess
}

export default connect(
  mapState,
  mapDispatch
)(Families)
