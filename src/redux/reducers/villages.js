import Immutable from 'seamless-immutable'
import { VILLAGE_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (villagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case VILLAGE_TYPES.VILLAGES_REQUESTING:
      return state.set('error', '').set('loading', true)

    case VILLAGE_TYPES.VILLAGES_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case VILLAGE_TYPES.VILLAGES_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
})
