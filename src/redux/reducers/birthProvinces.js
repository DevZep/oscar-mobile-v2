import Immutable from 'seamless-immutable'
import { BIRTH_PROVINCE_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case BIRTH_PROVINCE_TYPES.BIRTH_PROVINCES_REQUESTING:
      return state.set('error', '').set('loading', true)

    case BIRTH_PROVINCE_TYPES.BIRTH_PROVINCES_SUCCEED:
      return state.set('data', action.data).set('loading', false)

    case BIRTH_PROVINCE_TYPES.BIRTH_PROVINCES_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
