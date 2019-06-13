import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { fetchUser }          from '../../redux/actions/users'
import { pushScreen }         from '../../navigation/config'
import { fetchDomains }       from '../../redux/actions/domains'
import { StyleSheet, View }   from 'react-native'
import i18n                   from '../../i18n'
import TaskButton             from './TaskButton'

const TASK_COLORS = {
  overdue: '#e74d69',
  today: '#1ea9ab',
  upcoming: '#1ab394'
}
class Tasks extends Component {
  componentDidMount() {
    if (!this.props.clientId) {
      this.props.fetchUser()
      this.props.fetchDomains()
    }
  }

  getAllClientsTasksCount = () => {
    const { users, auth } = this.props
    const user = users[auth.id]
    if (!user) return { overdue: 0, today: 0, upcoming: 0 }

    const clients = user.clients || []
    const overdue = clients.reduce((sum, client) => (sum += client.overdue.length), 0)
    const today = clients.reduce((sum, client) => (sum += client.today.length), 0)
    const upcoming = clients.reduce((sum, client) => (sum += client.upcoming.length), 0)

    return { overdue, today, upcoming }
  }

  getClientTasksCount = () => {
    const { clients, clientId } = this.props
    const client = clients[clientId]
    return {
      overdue: client.tasks.overdue.length,
      today: client.tasks.today.length,
      upcoming: client.tasks.upcoming.length
    }
  }

  onTaskButtonClick = type => {
    const { users, auth, domains, clients, clientId, translations } = this.props
    const formTranslations = translations.client.tasks.form

    pushScreen(this.props.componentId, {
      screen: 'oscar.taskDetail',
      title: i18n.t(`task.${type}`),
      props: {
        type: type,
        user: users[auth.id],
        color: TASK_COLORS[type],
        domains: domains,
        client: clients[clientId],
        isClientTasksPage: !!clientId,
        formTranslations
      }
    })
  }

  render() {
    const taskCount = this.props.clientId ? this.getClientTasksCount() : this.getAllClientsTasksCount()

    const { overdue, today, upcoming } = taskCount
    const { translations } = this.props
    const indexTranslations = translations.tasks.index

    return (
      <View style={styles.mainContainer}>
        <TaskButton color={TASK_COLORS.overdue} data={overdue} title={indexTranslations.overdue_tasks} onPress={() => this.onTaskButtonClick('overdue')} />
        <TaskButton color={TASK_COLORS.today} data={today} title={indexTranslations.today_tasks} onPress={() => this.onTaskButtonClick('today')} />
        <TaskButton color={TASK_COLORS.upcoming} data={upcoming} title={indexTranslations.upcoming_tasks} onPress={() => this.onTaskButtonClick('upcoming')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#EDEFF1',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  }
})

const mapState = state => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return {
    users: state.users.data,
    auth: state.auth.data,
    domains: state.domains.data,
    clients: state.clients.data,
    translations
  }
}

const mapDispatch = {
  fetchUser,
  fetchDomains
}

export default connect(
  mapState,
  mapDispatch
)(Tasks)
