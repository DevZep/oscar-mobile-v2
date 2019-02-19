import axios from 'axios'
import { VILLAGE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestVillages = () => ({
  type: VILLAGE_TYPES.VILLAGES_REQUESTING
})

requestVillagesSucceed = data => ({
  type: VILLAGE_TYPES.VILLAGES_SUCCESS,
  data: data
})

requestVillagesFailed = error => ({
  type: VILLAGE_TYPES.VILLAGES_FAILED,
  error: error
})

export function fetchVillages() {
  return dispatch => {
    dispatch(requestVillages())
    axios
      .get(endpoint.villagesPath)
      .then(response => {
        dispatch(requestVillagesSucceed(response.data.villages))
      })
      .catch(error => {
        dispatch(requestVillagesFailed(error))
      })
  }
}
