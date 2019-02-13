import axios from 'axios'
import { COMMUNE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestCommunes = () => ({
  type: COMMUNE_TYPES.COMMUNES_REQUESTING
})

requestCommunesSucceed = data => ({
  type: COMMUNE_TYPES.COMMUNES_SUCCESS,
  data: data
})

requestCommunesFailed = error => ({
  type: COMMUNE_TYPES.COMMUNES_FAILED,
  error: error
})

export function fetchCommunes() {
  return dispatch => {
    dispatch(requestCommunes())
    axios
      .get(endpoint.communesPath)
      .then(response => {
        dispatch(requestCommunesSucceed(response.data.communes))
      })
      .catch(error => {
        dispatch(requestCommunesFailed(error))
      })
  }
}
