import Immutable from 'seamless-immutable'
import { DOMAIN_TYPES } from '../types'

const initialState = Immutable({
  data: [],
  error: '',
  loading: false
})

export default (ngoReducer = (state = initialState, action) => {
  switch (action.type) {
    case DOMAIN_TYPES.DOMAIN_REQUESTING:
      return state.set('error', '').set('loading', true)

    case DOMAIN_TYPES.DOMAIN_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case DOMAIN_TYPES.DOMAIN_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
})
