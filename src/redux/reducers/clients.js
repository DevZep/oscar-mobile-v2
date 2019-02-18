import Immutable from 'seamless-immutable'
import { CLIENT_TYPES } from '../types'

const initialState = Immutable({
  data: {},
  error: '',
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_TYPES.CLIENTS_REQUESTING:
      return state.set('error', '').set('loading', true)

    case CLIENT_TYPES.CLIENTS_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case CLIENT_TYPES.CLIENTS_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    case CLIENT_TYPES.UPDATE_CLIENT:
      return state.setIn(['data', action.client.id], action.client)

    case CLIENT_TYPES.CLIENT_CUSTOM_FORM:
      return state.setIn(['data', action.entityUpdated.id], action.entityUpdated)

    default:
      return state
  }
}
