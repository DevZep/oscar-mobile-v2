import React, { Component }       from 'react'
import { connect }                from 'react-redux'
import { ScrollView, View, Text } from 'react-native'
import { fetchFamilies }          from '../../redux/actions/families'
import FlatList                   from '../../components/FlatList'
import i18n                       from '../../i18n'
import styles                     from './styles'

class Families extends Component {
  componentDidMount() {
    this.props.fetchFamilies()
  }

  subItems = (family) => {
    const clientsCount = family.clients.length
    const familyType   = family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

    return [
      familyType,
      `${ clientsCount } ${ i18n.t('family.member_count') }`,
    ]
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
          data={ this.props.families }
          title={ ({ name }) => name || '(No Name)' }
          subItems={ this.subItems }
        />
      </ScrollView>
    )
  }
}

const mapState = (state) => ({
  families: state.families.data,
  loading: state.families.loading
})

const mapDispatch = {
  fetchFamilies
}

export default connect(mapState, mapDispatch)(Families)