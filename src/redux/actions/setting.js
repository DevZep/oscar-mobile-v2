import axios from "axios"
import { SETTING_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestSetting = () => ({
  type: SETTING_TYPES.SETTING_REQUESTING
})

requestSettingSucceed = data => ({
  type: SETTING_TYPES.SETTING_SUCCESS,
  data
})

requestSettingFailed = error => ({
  type: SETTING_TYPES.SETTING_FAILED,
  error
})

export function fetchSetting() {
  return dispatch => {
    dispatch(requestSetting())
    axios
      .get(endpoint.settingPath)
      .then( (response) => {
        dispatch(requestSettingSucceed(response.data.setting))
      }).catch((err) => {
        dispatch(requestSettingFailed(err))
      })
  }
}
