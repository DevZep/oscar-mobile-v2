import axios            from "axios"
import { Alert }        from "react-native"
import { Navigation }   from "react-native-navigation"
import moment           from "moment"
import endpoint         from "../../constants/endpoint"
import { updateUser }   from "./users"

export function deleteTask(task, clientId, taskType, onDeleteSuccess) {
  return (dispatch, getState) => {
    const isHasInternet = getState().internet.hasInternet
    const path = `${endpoint.clientsPath}/${clientId}${endpoint.deleteTaskPath}/${task.id}`
    if (!isHasInternet) {
      // dispatch(deleteTaskOffline(task, clientInfo, actions))
    } else {
      return axios.delete(path)
        .then(response => {
          dispatch(updateUserTasks(task, clientId, taskType, onDeleteSuccess, 'delete'))
          // dispatch(updateClientTasks(task, clientId, taskType, onDeleteSuccess))
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}

export function updateTask(params, task, clientId, taskType, onUpdateSuccess) {
  return (dispatch, getState) => {
    const isHasInternet = getState().internet.hasInternet
    const { editTaskPath, clientsPath } = endpoint
    const path = `${clientsPath}/${clientId}${editTaskPath}/${task.id}`

    if (isHasInternet) {
      axios
        .put(path, params)
        .then(response => {
          const updatedTask = { ...task, ...params }
          dispatch(updateUserTasks(updatedTask, clientId, taskType, onUpdateSuccess, 'update'))
          Alert.alert(
            'Update Task',
            'You have successfully updated task', 
            [{ text: 'OK', onPress: () => Navigation.dismissAllModals() }],
            { cancelable: false}
          )
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      // dispatch(taskOffline(params, 'update', clientProfile, actions, task_id))
    }
  }
}

// export function updateClientTasks(task, clientId, taskType, onSuccess, action) {
//   return (dispatch, getState) => {
//     const clients     = getState().clients.data
//     const client      = clients[clientId]
//     let   tasks       = client.tasks

//     if (action === 'update') {
//       const isUpcoming  = moment(task.completion_date).isAfter(Date.now(), 'day')
//       const isToday     = moment(task.completion_date).isSame(Date.now(), 'day')
//       const newTaskType = isUpcoming ? 'upcoming' : isToday ? 'today' : 'overdue'

//       if (taskType == newTaskType) {
//         tasks[taskType] = tasks[taskType].map(t => t.id === task.id ? task : t )
//       }
//       else {
//         tasks[taskType]    = tasks[taskType].filter(t => t.id !== task.id )
//         tasks[newTaskType] = tasks[newTaskType].concat(task)
//       }
//     }
//     if (action === 'delete')
//       tasks[taskType] = tasks[taskType].filter(t => t.id !== task.id )

//     return { ...client, tasks }
//     })
//   }
// }


export function updateUserTasks(task, clientId, taskType, onSuccess, action) {
  return (dispatch, getState) => {
    const users = getState().users.data
    const auth  = getState().auth.data
    const user  = users[auth.id]

    const clients = user.clients.map(client => {
      let tasks = {
        overdue: client.overdue,
        today: client.today,
        upcoming: client.upcoming,
      }

      if (client.id === clientId) {
        if (action === 'update') {
          const isUpcoming  = moment(task.completion_date).isAfter(Date.now(), 'day')
          const isToday     = moment(task.completion_date).isSame(Date.now(), 'day')
          const newTaskType = isUpcoming ? 'upcoming' : isToday ? 'today' : 'overdue'

          if (taskType == newTaskType) {
            tasks[taskType] = tasks[taskType].map(t => t.id === task.id ? task : t )
          }
          else {
            tasks[taskType]    = tasks[taskType].filter(t => t.id !== task.id )
            tasks[newTaskType] = tasks[newTaskType].concat(task)
          }
        }

        if (action === 'delete')
          tasks[taskType] = tasks[taskType].filter(t => t.id !== task.id )

        return { ...client, ...tasks }
      }
      return client
    })

    dispatch(updateUser({ ...user, clients }))
    onSuccess(null, { ...user, clients })
  }
}
