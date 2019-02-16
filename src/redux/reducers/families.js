import Immutable from 'seamless-immutable'
import { FAMILY_TYPES } from '../types'

const initialState = Immutable({
  data: {},
  error: '',
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case FAMILY_TYPES.FAMILY_UPDATE_SUCCESS:
      return state.setIn(['data', action.family.id], action.family)

    case FAMILY_TYPES.FAMILIES_REQUESTING:
      return state.set('error', '').set('loading', true)

    case FAMILY_TYPES.FAMILIES_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case FAMILY_TYPES.FAMILIES_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    case FAMILY_TYPES.CREATE_CUSTOM_FORM:
      return state.setIn(['data', action.familyUpdated.id], action.familyUpdated)

    default:
      return state
  }
}
