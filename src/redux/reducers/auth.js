import Immutable from 'seamless-immutable'
import { AUTH_TYPES, LOGOUT_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: null,
  headers: {},
  loading: false
})

export default (userReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TYPES.LOGIN_REQUEST:
      return state.set('error', '').set('loading', true)

    case AUTH_TYPES.LOGIN_REQUEST_SUCCESS:
      return state
        .set('data', action.data)
        .set('headers', action.headers)
        .set('loading', false)
        .set('error', '')

    case AUTH_TYPES.LOGIN_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    case AUTH_TYPES.RESET_AUTH_STATE:
      return state
        .set('error', '')
        .set('loading', false)
        .set('data', null)
        .set('headers', {})

    case AUTH_TYPES.UPDATE_USER_REQUESTING:
      return state.set('error', '').set('loading', true)

    case AUTH_TYPES.UPDATE_USER_FAILED:
      return state.set('error', action.err).set('loading', false)

    case LOGOUT_TYPES.LOGOUT_REQUESTING:
      return state.set('error', '').set('loading', true)

    case LOGOUT_TYPES.LOGOUT_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case LOGOUT_TYPES.LOGOUT_FAILED:
      return state.set('error', action.err).set('loading', false)

    case LOGOUT_TYPES.LOGOUT_RESET_STATE:
      return state
        .set('error', '')
        .set('data', null)
        .set('loading', false)

    default:
      return state
  }
})
