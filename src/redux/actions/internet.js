import { NetInfo } from 'react-native'
import { INTERNET_TYPES } from '../types'

updateConnection = connection => ({
  type: INTERNET_TYPES.UPDATE_CONNECTION,
  connection
})

export function checkConnection() {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      dispatch(updateConnection(isConnected))
    })
  }
}
