import Immutable from 'seamless-immutable'
import { TRANSLATION_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: {},
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case TRANSLATION_TYPES.TRANSLATIONS_REQUESTING:
      return state.set('error', '').set('loading', true)

    case TRANSLATION_TYPES.TRANSLATIONS_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case TRANSLATION_TYPES.TRANSLATIONS_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
