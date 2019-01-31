import React, { Component }       from 'react'
import { connect }                from 'react-redux'
import { ScrollView, View, Text } from 'react-native'
import { fetchClients }           from '../../redux/actions/clients'
import FlatList                   from '../../components/FlatList'
import i18n                       from '../../i18n'
import styles                     from './styles'

class Clients extends Component {
  componentDidMount() {
    this.props.fetchClients()
  }

  clientName = ({ given_name, family_name }) => {
    const fullName = [given_name, family_name].filter(Boolean).join(' ')
    return fullName || '(No Name)'
  }

  subItems = (client) => {
    const taskCount       = client.tasks.overdue.length
                            + client.tasks.today.length
                            + client.tasks.upcoming.length
    const assessmentCount = client.assessments.length
    const caseNoteCount   = client.case_notes.length

    return [
      `${ taskCount } ${ i18n.t('client.tasks') }`,
      `${ assessmentCount } ${ i18n.t('client.assessments') }`,
      `${ caseNoteCount } ${ i18n.t('client.case_notes') }`,
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
          data={this.props.clients}
          title={ this.clientName }
          subItems={ this.subItems }
          isClientList
        />
      </ScrollView>
    )
  }
}

const mapState = (state) => ({
  clients: state.clients.data,
  loading: state.clients.loading
})

const mapDispatch = {
  fetchClients
}

export default connect(mapState, mapDispatch)(Clients)