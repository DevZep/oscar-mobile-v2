import axios from 'axios'
import { NGO_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestNgo = () => ({
  type: NGO_TYPES.NGO_REQUESTING
})

requestNgoSuccess = data => ({
  type: NGO_TYPES.NGO_REQUEST_SUCCESS,
  data: data
})

requestNgoFailed = error => ({
  type: NGO_TYPES.NGO_REQUEST_FAILED,
  error: error
})

export function fetchNgos() {
  return dispatch => {
    dispatch(requestNgo())
    axios
      .get(endpoint.baseURL('start') + endpoint.ngoPath)
      .then(response => {
        dispatch(requestNgoSuccess(response.data.organizations))
      })
      .catch(error => {
        dispatch(requestNgoFailed(error))
      })
  }
}
