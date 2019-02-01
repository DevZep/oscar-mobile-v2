import axios from 'axios'
import { DOMAIN_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestDomain = () => ({
  type: DOMAIN_TYPES.DOMAIN_REQUESTING
})

requestDomainSuccess = data => ({
  type: DOMAIN_TYPES.DOMAIN_REQUEST_SUCCESS,
  data
})

requestDomainFailed = error => ({
  type: DOMAIN_TYPES.DOMAIN_REQUEST_FAILED,
  error
})

export function fetchDomains() {
  return dispatch => {
    dispatch(requestDomain())
    axios
      .get(endpoint.domainPath)
      .then(response => {
        dispatch(requestDomainSuccess(response.data.domains))
      })
      .catch(error => {
        dispatch(requestDomainFailed(error))
      })
  }
}
