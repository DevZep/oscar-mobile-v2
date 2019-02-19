import axios from 'axios'
import { DISTRICT_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestDistricts = () => ({
  type: DISTRICT_TYPES.DISTRICTS_REQUESTING
})

requestDistrictsSuccess = data => ({
  type: DISTRICT_TYPES.DISTRICTS_SUCCESS,
  data: data
})

requestDistrictsFailed = error => ({
  type: DISTRICT_TYPES.DISTRICTS_FAILED,
  error: error
})

export function fetchDistricts() {
  return dispatch => {
    dispatch(requestDistricts())
    axios
      .get(endpoint.districtsPath)
      .then(response => {
        dispatch(requestDistrictsSuccess(response.data.districts))
      })
      .catch(error => {
        dispatch(requestDistrictsFailed(error))
      })
  }
}
