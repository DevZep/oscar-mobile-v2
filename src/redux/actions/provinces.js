import axios from 'axios'
import { PROVINCE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestProvinces = () => ({
  type: PROVINCE_TYPES.PROVINCES_REQUESTING
})

requestProvincesSucceed = data => ({
  type: PROVINCE_TYPES.PROVINCES_SUCCEED,
  data: data
})

requestProvincesFailed = error => ({
  type: PROVINCE_TYPES.PROVINCES_FAILED,
  error: error
})

export function fetchProvinces() {
  return dispatch => {
    dispatch(requestProvinces())
    axios
      .get(endpoint.provincesPath)
      .then(response => {
        dispatch(requestProvincesSucceed(response.data))
      })
      .catch(error => {
        dispatch(requestProvincesFailed(error))
      })
  }
}
