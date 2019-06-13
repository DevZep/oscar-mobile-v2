import axios from 'axios'
import { TRANSLATION_TYPES } from '../types'
import endpoint from '../../constants/endpoint'
import template from 'lodash/template'
import Database from '../../config/Database'

requestTranslations = () => ({
  type: TRANSLATION_TYPES.TRANSLATIONS_REQUESTING
})

requestTranslationsSucceed = data => ({
  type: TRANSLATION_TYPES.TRANSLATIONS_SUCCESS,
  data: data
})

requestTranslationsFailed = error => ({
  type: TRANSLATION_TYPES.TRANSLATIONS_FAILED,
  error: error
})

export function fetchTranslations() {
  return dispatch => {
    dispatch(requestTranslations())
    axios
      .get(endpoint.translationsPath)
      .then(response => {
        dispatch(requestTranslationsSucceed(response.data))
      })
      .catch(error => {
        dispatch(requestTranslationsFailed(error))
      })
  }
}
