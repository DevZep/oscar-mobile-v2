import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { sortBy } from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Navigation } from 'react-native-navigation'
import i18n from '../../../i18n'
import { deleteTask, updateTask } from '../../../redux/actions/tasks'
import { updateUser } from '../../../redux/actions/users'
import Card from '../../../components/Card'
import styles from './styles'

import { View, Text, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native'

class TaskDetail extends Component {
  static options(passProps) {
    return {
      topBar: {
        background: {
          color: passProps.color
        }
      }
    }
  }

  state = {
    user: this.props.user,
    client: this.props.client
  }

  onDelete(task, client) {
    Alert.alert(i18n.t('task.delete_title'), i18n.t('task.delete_detail'), [
      { text: i18n.t('button.cancel'), style: 'cancel' },
      {
        text: i18n.t('button.save'),
        onPress: () => this.props.deleteTask(task, client.id, this.props.type, this.onUpdateSuccess)
      }
    ])
  }

  onUpdateTask = (task, client) => {
    Navigation.showModal({
      component: {
        name: 'oscar.editTask',
        passProps: {
          task,
          client,
          domains: this.props.domains,
          onUpdateTask: params => this.props.updateTask(params, task, client.id, this.props.type, this.onUpdateSuccess)
        }
      }
    })
  }

  onUpdateSuccess = (client, user) => {
    if (client) this.setState({ client })
    if (user) this.setState({ user })
  }

  clientName = ({ family_name, given_name }) => {
    const fullName = [given_name, family_name].filter(Boolean).join(' ')
    return fullName || '(No Name)'
  }

  renderClient = (client, tasks) => {
    if (tasks.length == 0) return null

    return (
      <Card key={client.id} title={this.clientName(client)} color={this.props.color}>
        <View style={styles.content}>
          {sortBy(tasks, task => task.domain.name).map(task => this.renderTask(task, client))}
        </View>
      </Card>
    )
  }

  renderTask = (task, client) => (
    <View style={styles.taskContainer} key={task.id}>
      <View style={styles.taskHeader}>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Domain: {task.domain.name}</Text>
          <Text style={styles.completionDate}>{moment(task.completion_date).format('dddd, MMMM D, YYYY')}</Text>
        </View>
        <View style={styles.iconContainer}>
          <View style={[styles.action, styles.iconEdit]}>
            <TouchableWithoutFeedback onPress={() => this.onUpdateTask(task, client)}>
              <Icon color="#1c84c6" name="edit" size={20} />
            </TouchableWithoutFeedback>
          </View>

          <View style={[styles.action, styles.iconDelete]}>
            <TouchableWithoutFeedback onPress={() => this.onDelete(task, client)}>
              <Icon color="#ED5565" name="delete" size={20} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.taskName}>
        <Text>{task.name}</Text>
      </View>
    </View>
  )

  render() {
    const { client, user } = this.state
    const { type, isClientTasksPage } = this.props

    return (
      <ScrollView style={styles.container}>
        {isClientTasksPage
          ? this.renderClient(client, client.tasks[type])
          : user.clients.map(client => this.renderClient(client, client[type]))}
      </ScrollView>
    )
  }
}

const mapDispatch = {
  updateTask,
  deleteTask,
  updateUser
}

export default connect(
  null,
  mapDispatch
)(TaskDetail)
