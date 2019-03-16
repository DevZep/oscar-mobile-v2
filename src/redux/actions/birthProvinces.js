import axios from 'axios'
import { BIRTH_PROVINCE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestBirthProvinces = () => ({
  type: BIRTH_PROVINCE_TYPES.BIRTH_PROVINCES_REQUESTING
})

requestBirthProvincesSucceed = data => ({
  type: BIRTH_PROVINCE_TYPES.BIRTH_PROVINCES_SUCCEED,
  data: data
})

requestBirthProvincesFailed = error => ({
  type: BIRTH_PROVINCE_TYPES.BIRTH_PROVINCES_FAILED,
  error: error
})

export function fetchBirthProvinces() {
  return dispatch => {
    dispatch(requestBirthProvinces())
    axios
      .get(endpoint.birthProvincesPath)
      .then(response => {
        dispatch(requestBirthProvincesSucceed(response.data.birth_provinces))
      })
      .catch(error => {
        dispatch(requestBirthProvincesFailed(error))
      })
  }
}
