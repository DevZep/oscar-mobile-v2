import Immutable from 'seamless-immutable'
import { SETTING_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: {},
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SETTING_TYPES.SETTING_REQUESTING:
      return state.set('error', '').set('loading', true)

    case SETTING_TYPES.SETTING_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case SETTING_TYPES.SETTING_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
