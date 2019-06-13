import React, { Component }       from 'react'
import { connect }                from 'react-redux'
import { sortBy, debounce }       from 'lodash'
import { Navigation }             from 'react-native-navigation'
import { deleteTask, updateTask } from '../../../redux/actions/tasks'
import Icon                       from 'react-native-vector-icons/MaterialIcons'
import i18n                       from '../../../i18n'
import Card                       from '../../../components/Card'
import moment                     from 'moment'
import styles                     from './styles'
import DropdownAlert              from 'react-native-dropdownalert'
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
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
    client: this.props.client,
    message: ''
  }

  componentWillReceiveProps(nextProps) {
    const { users, clients } = nextProps
    const { user, client } = this.state

    if (user) this.setState({ user: users[user.id] })

    if (client) this.setState({ client: clients[client.id] })
  }

  onDelete(task, client) {
    Alert.alert(i18n.t('task.delete_title'), i18n.t('task.delete_detail'), [
      {
        text: 'OK',
        onPress: () =>
          this.props.deleteTask(task, client.id, () => this.refs.dropdown.alertWithType('success', 'Success', 'Task has successfully been deleted.'))
      },
      { text: 'Cancel', style: 'cancel' }
    ])
  }

  onUpdateTask = debounce((task, client) => {
    const formTranslations = this.props.formTranslations
    Navigation.showModal({
      component: {
        name: 'oscar.taskForm',
        passProps: {
          task,
          client,
          domains: this.props.domains,
          formTranslations,
          onUpdateTask: params =>
            this.props.updateTask(params, task, client.id, this.props.type, () =>
              this.refs.dropdown.alertWithType('success', 'Success', 'Task has successfully been updated.')
            )
        }
      }
    })
  }, 1000, { maxWait: 1000, leading: true, trailing: false })

  clientName = ({ family_name, given_name }) => {
    const fullName = [given_name, family_name].filter(Boolean).join(' ')
    return fullName || '(No Name)'
  }

  renderClient = (client, tasks) => {
    if (tasks.length == 0) return null

    return (
      <Card key={client.id} title={this.clientName(client)} color={this.props.color}>
        <View style={styles.content}>{sortBy(tasks, task => task.domain.name).map(task => this.renderTask(task, client))}</View>
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
      <View style={styles.container}>
        <ScrollView>
          {isClientTasksPage ? this.renderClient(client, client.tasks[type]) : user.clients.map(client => this.renderClient(client, client[type]))}
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = state => ({
  users: state.users.data,
  clients: state.clients.data,
  message: state.clients.message
})

const mapDispatch = {
  updateTask,
  deleteTask
}

export default connect(
  mapState,
  mapDispatch
)(TaskDetail)
