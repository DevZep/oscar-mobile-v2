import axios            from "axios"
import { Alert }        from "react-native"
import { Navigation }   from "react-native-navigation"
import endpoint         from "../../constants/endpoint"
import { updateClient } from "./clients"

export function updateAssessment(params, assessmentId, client, previousComponentId, onSuccess) {
  return (dispatch, getState) => {
    const hasInternet      = getState().internet.hasInternet
    const path             = endpoint.clientsPath + '/' + client.id + endpoint.assessmentsPath + '/' + assessmentId
    const assessmentParams = handleAssessmentParams(params, 'update')

    if (hasInternet) {
      axios.put(path, assessmentParams)
        .then(response => {
          client.assessments.forEach(assessment => {
            if (assessment.id === assessmentId)
              assessment.assessment_domain = params.assessmentDomains
          })
          updateClient(client)
          onSuccess(client)

          Alert.alert(
            'Assessment',
            'You has been successfully updated an assessment.',
            [{ text: 'Ok', onPress: () => Navigation.popTo(previousComponentId) }],
            { cancelable: false }
          )
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}


export function createAssessment(params, client, previousComponentId, onSuccess) {
  return (dispatch, getState) => {
    const hasInternet      = getState().internet.hasInternet
    const path             = endpoint.clientsPath + '/' + client.id + endpoint.assessmentsPath
    const assessmentParams = handleAssessmentParams(params, 'create')

    if (hasInternet) {
      axios.post(path, assessmentParams)
        .then(response => {
          client.assessments.push(response.data.assessment)
          updateClient(client)
          onSuccess(client)

          Alert.alert(
            'Assessment',
            'You has been successfully created an assessment.',
            [{ text: 'Ok', onPress: () => Navigation.popTo(previousComponentId) }],
            { cancelable: false }
          )
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }
}

handleAssessmentParams = (params, action) => {
  let formdata = new FormData()

  params.assessmentDomains.forEach((ad, index) => {
    formdata.append(`assessment[default]`, params.default)

    if (action === 'update')
      formdata.append(`assessment[assessment_domains_attributes[${index}][id]]`,      ad.id)
    formdata.append(`assessment[assessment_domains_attributes[${index}][domain_id]]`, ad.domain_id)
    formdata.append(`assessment[assessment_domains_attributes[${index}][score]]`,     ad.score)
    formdata.append(`assessment[assessment_domains_attributes[${index}][reason]]`,    ad.reason)
    formdata.append(`assessment[assessment_domains_attributes[${index}][goal]]`,      ad.goal)

    if (ad.attachments.length > 0) {
      ad.attachments.map(attachment => {
        if (attachment.uri != undefined && attachment.name != undefined) {
          formdata.append(
            `assessment[assessment_domains_attributes[${index}][attachments]][]`,
            {
              uri: attachment.uri,
              name: attachment.name,
              type: attachment.type
            }
          )
        }
      })
    } else {
      formdata.append(`assessment[assessment_domains_attributes[${index}][attachments]][]`, '')
    }
  })

  return formdata
}
