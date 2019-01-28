import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { fetchUser }        from '../../redux/actions/users'
import { fetchDomains }     from '../../redux/actions/domains'
import i18n                 from '../../i18n'
import styles               from './styles'

import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

const TaskButton = ({ title, data, onPress, color }) => (
  <TouchableWithoutFeedback onPress={ data > 0 ? onPress : null }>
    <View style={[styles.task, {backgroundColor: data === 0 ? '#888' : color}]}>
      <Text style={styles.number}>{ data }</Text>
      <Text style={styles.title}>{ title }</Text>
    </View>
  </TouchableWithoutFeedback>
)

class Tasks extends Component {
  componentDidMount() {
    this.props.fetchUser()
    this.props.fetchDomains()
  }

  onTaskButtonClick = (type) => {
  }

  taskCount = (type) => {
    const { users, auth } = this.props
    const user  = users[auth.id]

    if (!user) return 0
    const tasks = user.clients.map(client => client[type]).flat()
    return tasks.length
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <TaskButton
          title={ i18n.t('task.overdue') }
          data={ this.taskCount('overdue') }
          color='#e74d69'
          onPress={ () => this.onTaskButtonClick('overdue') }
        />
        <TaskButton
          title={ i18n.t('task.today') }
          data={ this.taskCount('today') }
          color='#1ea9ab'
          onPress={ () => this.onTaskButtonClick('today') }
        />
        <TaskButton
          title={ i18n.t('task.upcoming') }
          data={ this.taskCount('upcoming') }
          color='#1ab394'
          onPress={ () => this.onTaskButtonClick('upcoming') }
        />
      </View>
    )
  }
}

const mapState = (state) => ({
  users: state.users.data,
  auth: state.auth.data,
  domains: state.domains.data
})

const mapDispatch = {
  fetchUser,
  fetchDomains
}

export default connect(mapState, mapDispatch)(Tasks)
