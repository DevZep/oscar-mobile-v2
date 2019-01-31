import Immutable from 'seamless-immutable'
import { NGO_TYPES } from '../types'

const initialState = Immutable({
  name: 'demo',
  error: '',
  data: [],
  loading: false
})

export default (ngoReducer = (state = initialState, action) => {
  switch (action.type) {
    case NGO_TYPES.SET_NGO_NAME:
      return state.set('name', action.name)

    case NGO_TYPES.NGO_REQUESTING:
      return state.set('error', '').set('loading', true)

    case NGO_TYPES.NGO_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case NGO_TYPES.NGO_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
})
