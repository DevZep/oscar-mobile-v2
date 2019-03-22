import axios                  from 'axios'
import { map }                from 'lodash'
import { Navigation }         from 'react-native-navigation'
import { FAMILY_TYPES }       from '../types'
import { loadingScreen }      from '../../navigation/config'
import { Alert, NetInfo }     from 'react-native'
import endpoint               from '../../constants/endpoint'
import i18n                   from '../../i18n'

requestFamilies = () => ({
  type: FAMILY_TYPES.FAMILIES_REQUESTING
})

requestFamiliesSuccess = data => ({
  type: FAMILY_TYPES.FAMILIES_REQUEST_SUCCESS,
  data
})

requestFamiliesFailed = error => ({
  type: FAMILY_TYPES.FAMILIES_REQUEST_FAILED,
  error
})

updateFamilySuccess = family => ({
  type: FAMILY_TYPES.FAMILY_UPDATE_SUCCESS,
  family
})

export function fetchFamilies() {
  return dispatch => {
    dispatch(requestFamilies())
    axios
      .get(endpoint.familiesPath)
      .then(response => {
        const families = response.data.families.reduce((res, family) => {
          res[family.id] = family
          return res
        }, {})
        dispatch(requestFamiliesSuccess(families))
      })
      .catch(error => {
        dispatch(requestFamiliesFailed(error))
      })
  }
}

export function updateFamily(familyParams, actions) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        loadingScreen()
        dispatch(requestFamilies())
        axios
          .put(endpoint.familiesPath + '/' + familyParams.id, familyParams)
          .then(response => {
            dispatch(updateFamilySuccess(response.data.family))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(actions.familyDetailComponentId)
            actions.alertMessage()
          })
          .catch(error => {
            let errors = map(error.response.data, (value, key) => {
              return i18n.t('family.' + key, { locale: 'en' }) + ' ' + value[0]
            })
            Navigation.dismissOverlay('LOADING_SCREEN')
            dispatch(requestFamiliesFailed(errors))
          })
      } else {
        Alert.alert('No internet connection')
      }
    })
  }
}
