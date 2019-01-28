import axios                        from "axios"
import { Alert, AsyncStorage }      from "react-native"
import CryptoJS                     from 'crypto-js'
import { AUTH_TYPES }               from "../types"
import endpoint                     from "../../constants/endpoint"
import i18n                         from '../../i18n'
import {
  pushScreen,
  startScreen,
  startTabScreen,
  startNgoScreen
} from "../../navigation/config"

requestLogin = () => ({
  type: AUTH_TYPES.LOGIN_REQUEST
})

requestLoginSuccess = ({ data, headers }) => ({
  type: AUTH_TYPES.LOGIN_REQUEST_SUCCESS,
  data: data.data,
  headers
})

requestLoginFailed = error => ({
  type: AUTH_TYPES.LOGIN_REQUEST_FAILED,
  error: error
})

requestUpdateUser = () => ({
  type: AUTH_TYPES.UPDATE_USER_REQUESTING
})

requestUpdateUserSuccess = data => ({
  type: AUTH_TYPES.UPDATE_USER_SUCCESS,
  data: data
})

requestUpdateUserFailed = err => ({
  type: AUTH_TYPES.UPDATE_USER_FAILED,
  err: err
})

formatHeaders = (headers) => ({
  "access-token": headers["access-token"],
  client: headers["client"],
  uid: headers["uid"]
})

export function setDefaultHeader(accHeaders) {
  let headers = accHeaders
  return (dispatch, getState) => {
    const org = getState().ngo.name
    if (headers == null) {
      headers = getState().auth.headers
    }
    axios.defaults.headers.common['access-token'] = headers['access-token']
    axios.defaults.headers.common['client'] = headers['client']
    axios.defaults.headers.common['uid'] = headers['uid']
    axios.defaults.baseURL = endpoint.baseURL(org)
  }
}

export function updatePin(pinCode) {
  return (dispatch, getState) => {
    const org = getState().ngo.name
    const headers = getState().auth.headers
    dispatch(requestLogin())
    axios
      .put(
        endpoint.baseURL(org) + endpoint.updateTokenPath,
        { pin_code: pinCode },
        { headers: formatHeaders(headers) }
      )
      .then(response => {
        dispatch(requestLoginSuccess(response))
        dispatch(setDefaultHeader(response.headers))
        startTabScreen()
      })
      .catch(err => {
        dispatch(requestLoginFailed(err.response.data.errors[0]))
      })
  }
}

export function login(credentail, currentComponentId) {
  return (dispatch, getState) => {
    const org = getState().ngo.name
    dispatch(requestLogin())
    axios
      .post(endpoint.baseURL(org) + endpoint.login, credentail)
      .then(response => {
        const { pin_code } = response.data.data
        pin_code && dispatch(setDefaultHeader(response.headers))

        dispatch(requestLoginSuccess(response))
        pushScreen(currentComponentId, {
          screen: 'oscar.pin',
          topBar: false,
          drawBehind: true,
          props: {
            pinTitle: pin_code ? i18n.t('auth.enter_pin') : i18n.t('auth.set_pin'),
            pinMode: pin_code ? 'compare' : 'set',
            pinCode: pin_code && CryptoJS.SHA3(pin_code)
          }
        })
      })
      .catch(err => {
        dispatch(requestLoginFailed(err.response.data.errors[0]))
      })
  }
}

// export function updateUser(userParam, navigator, updateStateAuth) {
//   return (dispatch, getState) => {
//     const org     = getState().ngo.get("name")
//     const headers = getState().auth.get("headers")
//     const config  = { headers: formatHeaders(headers) }

//     dispatch(requestUpdateUser())
//     return axios
//       .put(endpoint.baseURL(org) + endpoint.updateTokenPath, userParam, config)
//       .then(response => {
//         dispatch(requestUpdateUserSuccess(response.data))
//         updateStateAuth(response.data)
//         Alert.alert(
//           "User",
//           "You has been successfully updated user.",
//           [{ text: "Ok", onPress: () => navigator.pop({}) }],
//           { cancelable: false }
//         )
//       })
//       .catch(err => {
//         dispatch(
//           requestUpdateUserFailed(err.response.data.errors.full_messages[0])
//         )
//         Alert.alert("User", err.response.data.errors.full_messages[0])
//       })
//   }
// }

export function verifyUser(goToPin) {
  return (dispatch, getState) => {
    const org     = getState().ngo.name
    const headers = getState().auth.headers
    const config  = { headers: formatHeaders(headers) }
    axios
      .get(endpoint.baseURL(org) + endpoint.tokenValidationPath, config)
      .then((response) => {
        const { pin_code } = response.data.data
        dispatch(requestLoginSuccess(response))
        dispatch(setDefaultHeader(response.headers))
        goToPin(CryptoJS.SHA3(pin_code))
      })
      .catch((err) => {
        startNgoScreen()
        dispatch(clearAppData())
        Alert.alert("Session", 'User session has been expired.')
        dispatch(requestLoginFailed(err.response.data.errors.full_messages[0]))
      })
  }
}

export function clearAppData() {
  return dispatch => {
    setTimeout(function () {
      dispatch({ type: AUTH_TYPES.RESET_AUTH_STATE})
      AsyncStorage.clear()
    }, 500);
  }
}
