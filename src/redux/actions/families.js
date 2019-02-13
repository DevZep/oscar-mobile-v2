import axios from 'axios'
import { FAMILY_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestFamilies = () => ({
  type: FAMILY_TYPES.FAMILIES_REQUESTING
})

requestFamiliesSuccess = data => ({
  type: FAMILY_TYPES.FAMILIES_REQUEST_SUCCESS,
  data
})

requestFamiliesFailed = error => ({
  type: FAMILY_TYPES.FAMILIES_REQUEST_FAILED,
  error
})

updateFamilySuccess = family => ({
  type: FAMILY_TYPES.UPDATE_FAMILY,
  family
})

export function fetchFamilies() {
  return dispatch => {
    dispatch(requestFamilies())
    axios
      .get(endpoint.familiesPath)
      .then(response => {
        const families = response.data.families.reduce((res, family) => {
          res[family.id] = family
          return res
        }, {})
        dispatch(requestFamiliesSuccess(families))
      })
      .catch(error => {
        dispatch(requestFamiliesFailed(error))
      })
  }
}

export function updateFamily(familyParams) {
  return (dispatch, getState) => {
    const org = getState().ngo.name
    const headers = getState().auth.headers
    const config = { headers: formatHeaders(headers) }

    dispatch(requestFamilies())
    axios
      .put(endpoint.familiesPath + '/' + familyParams.id, familyParams, config)
      .then(response => {
        dispatch(updateFamilySuccess(response.data.family))
        Alert.alert(
          'Message',
          'You have update successfully.',
          [{ text: 'Ok', onPress: () => Navigation.popTo('FAMILIES_TAB_BAR_BUTTON') }],
          { cancelable: false }
        )
      })
      .catch(error => {
        console.log(error)
      })
  }
}
