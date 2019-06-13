import axios                      from 'axios'
import moment                     from 'moment'
import { map, size }              from 'lodash'
import { Alert, NetInfo }         from 'react-native'
import { Navigation }             from 'react-native-navigation'
import { CLIENT_TYPES }           from '../types'
import { loadingScreen }          from '../../navigation/config'
import endpoint                   from '../../constants/endpoint'
import i18n                       from '../../i18n'

requestClients = () => ({
  type: CLIENT_TYPES.CLIENTS_REQUESTING
})

requestClientsSuccess = data => ({
  type: CLIENT_TYPES.CLIENTS_REQUEST_SUCCESS,
  data
})

requestClientsFailed = error => ({
  type: CLIENT_TYPES.CLIENTS_REQUEST_FAILED,
  error
})

export const updateClient = (client, message = '') => ({
  type: CLIENT_TYPES.UPDATE_CLIENT,
  client,
  message
})

export function updateClientProperty(clientParams, actions) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        loadingScreen()
        dispatch(requestClients())
        dispatch(handleUpdateClientParams(clientParams, clientParams.id))
          .then(response => {
            const message = 'You have update successfully.'
            const {given_name, family_name} = clientParams
            const fullName = [given_name, family_name].filter(Boolean).join(' ') || '(No Name)'
            dispatch(updateClient(response.data.client, message))
            Navigation.mergeOptions(actions.clientDetailComponentId, {
              topBar: {
                title: {
                  text: fullName
                }
              }
            })
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(actions.clientDetailComponentId)
            actions.alertMessage()
          })
          .catch(error => {
            let errors = map(error.response.data, (value, key) => {
              return i18n.t('client.form.' + key, { locale: 'en' }) + ' ' + value[0]
            })
            Navigation.dismissOverlay('LOADING_SCREEN')
            dispatch(requestClientsFailed(errors))
          })
      } else {
        Alert.alert('No internet connection')
      }
    })
  }
}

export const acceptClient = client => {
  return dispatch => {
    const path = endpoint.clientsPath + '/' + client.id + endpoint.enterNgoPath
    loadingScreen()
    dispatch(requestClients())
    axios
      .post(path, { enter_ngo: { accepted_date: moment().format("YYYY-MM-DD") } })
      .then(response => {
        dispatch(updateClient(response.data.client))
        Navigation.dismissOverlay('LOADING_SCREEN')
      })
      .catch(error => {
        Navigation.dismissOverlay('LOADING_SCREEN')
        dispatch(requestClientsFailed(error))
      })
  }
}

export const rejectClient = (client, params) => {
  return dispatch => {
    const path = endpoint.clientsPath + '/' + client.id + endpoint.exitNgoPath
    loadingScreen()
    dispatch(requestClients())
    axios
      .post(path, { exit_ngo: params  })
      .then(response => {
        dispatch(updateClient(response.data.client))
        Navigation.dismissOverlay('LOADING_SCREEN')
        Navigation.dismissAllModals()
      })
      .catch(error => {
        dispatch(requestClientsFailed(error))
        Navigation.dismissOverlay('LOADING_SCREEN')
        Navigation.dismissAllModals()
      })
  }
}

export function fetchClients() {
  return dispatch => {
    dispatch(requestClients())
    axios
      .get(endpoint.clientsPath)
      .then(response => {
        const clients = response.data.clients.reduce((res, client) => {
          res[client.id] = client
          return res
        }, {})
        dispatch(requestClientsSuccess(clients))
      })
      .catch(error => {
        dispatch(requestClientsFailed(error))
      })
  }
}

export function handleUpdateClientParams(client, client_id) {
  return dispatch => {
    const EndPoint = endpoint.clientsPath + '/' + client_id
    let formData = new FormData()
    const profile = client.profile || {}
    const keyParams = [
      'kid_id',
      'code',
      'assessment_id',
      'given_name',
      'family_name',
      'local_given_name',
      'local_family_name',
      'gender',
      'date_of_birth',
      'birth_province_id',
      'initial_referral_date',
      'referral_source_id',
      'referral_source_category_id',
      'referral_phone',
      'received_by_id',
      'followed_up_by_id',
      'follow_up_date',
      'school_grade',
      'school_name',
      'current_address',
      'house_number',
      'street_number',
      'village_id',
      'commune_id',
      'district_id',
      'has_been_in_orphanage',
      'has_been_in_government_care',
      'relevant_referral_information',
      'province_id',
      'state',
      'rejected_note',
      'able',
      'able_state',
      'rated_for_id_poor',
      'live_with',
      'telephone_number',
      'name_of_referee',
      'main_school_contact',
      'what3words'
    ]

    keyParams.forEach(key => {
      formData.append(`client[${key}]`, client[key] || '')
    })

    size(profile) > 1 && formData.append('client[profile]', profile)

    if (client.agency_ids.length > 0) {
      client.agency_ids.forEach(value => {
        formData.append('client[agency_ids][]', value)
      })
    } else {
      formData.append('client[agency_ids][]', '')
    }

    if (client.donor_ids.length > 0) {
      client.donor_ids.forEach(value => {
        formData.append('client[donor_ids][]', value)
      })
    } else {
      formData.append('client[donor_ids][]', '')
    }

    if (client.user_ids.length > 0) {
      client.user_ids.forEach(value => {
        formData.append('client[user_ids][]', value)
      })
    } else {
      formData.append('client[user_ids][]', '')
    }

    if (client.quantitative_case_ids.length > 0) {
      client.quantitative_case_ids.forEach(value => {
        formData.append('client[quantitative_case_ids][]', value)
      })
    } else {
      formData.append('client[quantitative_case_ids][]', '')
    }

    return axios.put(EndPoint, formData)
  }
}
