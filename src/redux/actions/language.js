import { LANGUAGE_TYPES } from '../types'

requestLanguageSuccess = language => ({
  type: LANGUAGE_TYPES.SET_LANGUAGE,
  language
})

export function updateLanguage(language) {
  return dispatch => {
    dispatch(requestLanguageSuccess(language))
  }
}
