import Immutable from 'seamless-immutable'
import { DISTRICT_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (districtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISTRICT_TYPES.DISTRICTS_REQUESTING:
      return state.set('error', '').set('loading', true)

    case DISTRICT_TYPES.DISTRICTS_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case DISTRICT_TYPES.DISTRICTS_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
})
