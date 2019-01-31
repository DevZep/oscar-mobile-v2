import axios            from "axios"
import { FAMILY_TYPES } from "../types"
import endpoint         from "../../constants/endpoint"

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

export function fetchFamilies() {
  return (dispatch) => {
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
