import axios            from "axios"
import { CLIENT_TYPES } from "../types"
import endpoint         from "../../constants/endpoint"

requestClients = () => ({
  type: CLIENT_TYPES.CLIENTS_REQUESTING
})

requestClientsSuccess = data => ({
  type: CLIENT_TYPES.CLIENTS_REQUEST_SUCCESS,
  data
})

requestClientsFailed = error => ({
  type: CLIENT_TYPES.CLIENTS_REQUEST_FAILED,
  error
})

export function fetchClients() {
  return (dispatch) => {
    dispatch(requestClients())
    axios
      .get(endpoint.clientsPath)
      .then(response => {
        const clients = response.data.clients.reduce((res, client) => {
          res[client.id] = client
          return res
        }, {})
        dispatch(requestClientsSuccess(clients))
      })
      .catch(error => {
        dispatch(requestClientsFailed(error))
      })
  }
}
