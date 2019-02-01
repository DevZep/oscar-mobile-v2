import Immutable from 'seamless-immutable'
import { LANGUAGE_TYPES } from '../types'

const initialState = Immutable({
  language: 'en'
})

export default (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE_TYPES.SET_LANGUAGE:
      return state.set('language', action.language)

    default:
      return state
  }
}
