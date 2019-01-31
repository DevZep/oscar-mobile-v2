import Immutable from 'seamless-immutable'
import { INTERNET_TYPES } from '../types'

const initialState = Immutable({
  hasInternet: false
})

export default (internetReducer = (state = initialState, action) => {
  switch (action.type) {
    case INTERNET_TYPES.UPDATE_CONNECTION:
      return state.set('hasInternet', action.connection)

    default:
      return state
  }
})
