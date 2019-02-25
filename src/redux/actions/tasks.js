import axios            from "axios"
import { Alert }        from "react-native"
import { Navigation }   from "react-native-navigation"
import moment           from "moment"
import endpoint         from "../../constants/endpoint"
import { updateUser }   from "./users"
import { updateClient } from "./clients"

export function deleteTask(task, clientId, onDeleteSuccess) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    const path        = `${endpoint.clientsPath}/${clientId}${endpoint.deleteTaskPath}/${task.id}`

    if (hasInternet) {
      return axios.delete(path)
        .then(response => {
          dispatch(updateClientTask(task, null, clientId, 'delete'))
          dispatch(updateUserTasks(task, null, clientId, 'delete'))
          onDeleteSuccess && onDeleteSuccess(task)
        }).catch(handleError)
    }
  }
}

export function updateTask(params, task, clientId, taskType, onUpdateSuccess) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    const path        = `${endpoint.clientsPath}/${clientId}${endpoint.editTaskPath}/${task.id}`

    if (hasInternet) {
      axios
        .put(path, params)
        .then(response => {
          const updatedTask = response.data.task
          dispatch(updateClientTask(updatedTask, taskType, clientId, 'update'))
          dispatch(updateUserTasks(updatedTask, taskType, clientId, 'update'))
          onUpdateSuccess && onUpdateSuccess(updatedTask)

          Alert.alert(
            'Update Task',
            'You have successfully updated task', 
            [{ text: 'OK', onPress: () => Navigation.dismissAllModals() }],
            { cancelable: false}
          )
        }).catch(handleError)
    }
  }
}

export function createTask(params, clientId, onCreateSuccess) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    const path        = `${endpoint.clientsPath}/${clientId}${endpoint.createTaskPath}`

    if (hasInternet) {
      axios
        .post(path, params)
        .then(response => {
          const task = response.data.task
          dispatch(updateClientTask(task, null, clientId, 'create'))
          dispatch(updateUserTasks(task, null, clientId, 'create'))
          onCreateSuccess && onCreateSuccess(task)

          Alert.alert(
            'Update Task',
            'You have successfully updated task', 
            [{ text: 'OK', onPress: () => Navigation.dismissAllModals() }],
            { cancelable: false}
          )
        }).catch(handleError)
    }
  }
}

export function updateClientTask(task, oldTaskType, clientId, action) {
  return (dispatch, getState) => {
    const clients   = getState().clients.data
    const taskType  = getTaskType(task)
    const client    = clients[clientId]
    let   tasks     = { ...client.tasks }

    if (action === 'update')
      if (taskType == oldTaskType)
        tasks[taskType] = tasks[taskType].map(t => t.id === task.id ? task : t )
      else {
        tasks[oldTaskType] = tasks[oldTaskType].filter(t => t.id !== task.id )
        tasks[taskType]    = tasks[taskType].concat(task)
      }

    if (action === 'delete')
      tasks[taskType] = tasks[taskType].filter(t => t.id !== task.id )

    if (action === 'create')
      tasks[taskType] = tasks[taskType].concat(task)

    dispatch(updateClient({ ...client, tasks }))
  }
}


export function updateUserTasks(task, oldTaskType, clientId, action) {
  return (dispatch, getState) => {
    const users    = getState().users.data
    const auth     = getState().auth.data
    const taskType = getTaskType(task)
    const user     = users[auth.id]

    const clients  = user.clients.map(client => {
      let tasks = {
        overdue: client.overdue,
        today: client.today,
        upcoming: client.upcoming,
      }

      if (client.id === clientId) {
        if (action === 'update') 
          if (taskType == oldTaskType)
            tasks[taskType] = tasks[taskType].map(t => t.id === task.id ? task : t )
          else {
            tasks[oldTaskType] = tasks[oldTaskType].filter(t => t.id !== task.id )
            tasks[taskType]    = tasks[taskType].concat(task)
          }

        if (action === 'delete')
          tasks[taskType] = tasks[taskType].filter(t => t.id !== task.id )

        if (action === 'create')
          tasks[taskType] = tasks[taskType].concat(task)

        return { ...client, ...tasks }
      }
      return client
    })

    dispatch(updateUser({ ...user, clients }))
  }
}


handleError = error => console.log(error)

getTaskType = task => {
  const isUpcoming  = moment(task.completion_date).isAfter(Date.now(), 'day')
  const isToday     = moment(task.completion_date).isSame(Date.now(), 'day')

  return isUpcoming ? 'upcoming' : isToday ? 'today' : 'overdue'
}

