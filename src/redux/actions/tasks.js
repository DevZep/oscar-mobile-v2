import axios            from "axios"
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
          dispatch(updateUserTasks(task, clientId, taskType, onDeleteSuccess))
          // dispatch(updateClientTasks(task, clientId, taskType, onDeleteSuccess))
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}

// export function updateClientTasks(task, clientId, taskType, onDeleteSuccess) {
//   return (dispatch, getState) => {
//     const clients     = getState().clients.data
//     const client      = clients[clientId]
//     const updatedTask = client.tasks[taskType].filter(t => t.id !== task.id)
//     const tasks       = { ...client.tasks, [taskType]: updatedTask }

//     return { ...client, tasks }
//     })
//   }
// }


export function updateUserTasks(task, clientId, taskType, onDeleteSuccess) {
  return (dispatch, getState) => {
    const users   = getState().users.data
    const auth    = getState().auth.data
    const user    = users[auth.id]

    const clients = user.clients.map(client => {
      if (client.id === clientId) {
        const tasks = client[taskType].filter(t => t.id !== task.id )
        return { ...client, [taskType]: tasks }
      }
      return client
    })

    dispatch(updateUser({ ...user, clients }))
    onDeleteSuccess(null, { ...user, clients })
  }
}
