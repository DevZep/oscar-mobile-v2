import Immutable from 'seamless-immutable'
import { USER_TYPES } from '../types'

const initialState = Immutable({
  data: {},
  error: '',
  loading: false
})

export default (ngoReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_TYPES.UPDATE_USER:
      return state.setIn(['data', action.user.id], action.user)

    case USER_TYPES.USERS_REQUESTING:
      return state.set('error', '').set('loading', true)

    case USER_TYPES.USERS_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case USER_TYPES.USERS_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
})
