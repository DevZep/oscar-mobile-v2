import axios from 'axios'
import { Alert } from 'react-native'
import { FAMILY_TYPES } from '../types'
import endpoint from '../../constants/endpoint'
import { formTypes } from '../../utils/validation'
import _ from 'lodash'
import { Navigation } from 'react-native-navigation'

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

createFamilyCustomFormSuccess = familyUpdated => ({
  type: FAMILY_TYPES.CREATE_CUSTOM_FORM,
  familyUpdated
})

formatHeaders = headers => ({
  'access-token': headers['access-token'],
  client: headers['client'],
  uid: headers['uid']
})

addFamilyCustomFormState = (family, newCustomFieldProperty, form) => {
  form['custom_field_properties'] = [newCustomFieldProperty]
  const updateForms = family.add_forms.filter(add_form => {
    return add_form.id !== form.id
  })
  family.add_forms = updateForms
  family.additional_form = [form, ...family.additional_form]
  return family
}

updateStateAdditionalFormInFamily = (family, updatedCustomFieldProperty, additionalForm) => {
  let newForm = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForm = _.map(family.additional_form, form => {
      if (form.id === updatedCustomFieldProperty.custom_field_id) {
        const newCustomFieldProperties = _.map(form.custom_field_properties, customFieldProperty => {
          if (customFieldProperty.id === updatedCustomFieldProperty.id) {
            return updatedCustomFieldProperty
          }
          return customFieldProperty
        })
        form.custom_field_properties = newCustomFieldProperties
        return form
      }
      return form
    })
    family.additional_form = newForm
  }
  return family
}

mergeStateAdditionalFormInFamily = (family, newCustomFieldProperty, additionalForm) => {
  let newForm = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForm = _.map(family.additional_form, form => {
      if (form.id === newCustomFieldProperty.custom_field_id) {
        form.custom_field_properties = [newCustomFieldProperty, ...form.custom_field_properties]
        return form
      }
      return form
    })
    family.additional_form = newForm
  }
  return family
}

deleteStateAdditionalFormInFamily = (family, deletedCustomFieldProperty, additionalForm) => {
  let newAddForms = []
  let newAdditionalForms = []
  let newForms = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForms = _.map(family.additional_form, form => {
      if (form.id === deletedCustomFieldProperty.custom_field_id) {
        const updatedCustomFieldProperties = _.filter(form.custom_field_properties, customFieldProperty => {
          return customFieldProperty.id !== deletedCustomFieldProperty.id
        })
        return { ...form, custom_field_properties: updatedCustomFieldProperties }
      }
      return form
    })
  }
  const customFormDeleted = _.find(newForms, { id: additionalForm.id })
  if (customFormDeleted.custom_field_properties.length === 0) {
    newAddForms = [customFormDeleted, ...newAddForms]
    newAdditionalForms = _.filter(family.additional_form, additional_form => {
      return additional_form.id != customFormDeleted.id
    })
    return {
      ...family,
      additional_form: newAdditionalForms,
      add_forms: [...newAddForms, ...family.add_forms]
    }
  }

  return {
    ...family,
    additional_form: newForms
  }
}

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
    dispatch(requestFamilies())
    axios
      .put(endpoint.familiesPath + '/' + familyParams.id, familyParams)
      .then(response => {
        dispatch(updateFamilySuccess(response.data.family))
        Alert.alert(
          'Message',
          'You have update successfully.',
          [{ text: 'Ok', onPress: () => Navigation.popTo(actions.familyDetailComponentId) }],
          { cancelable: false }
        )
      })
      .catch(error => {
        let errors = _.map(error.response.data, (value, key) => {
          return _.capitalize(key) + ' ' + value[0]
        })
        alert(errors)
      })
  }
}

export function createFamilyAdditionalForm(properties, familyProfile, additionalForm, actions) {
  return dispatch => {
    let familyUpdated = {}
    let createFamilyAdditonalFormPath = _.template(endpoint.createFamilyAdditonalFormPath)
    createFamilyAdditonalFormPath = createFamilyAdditonalFormPath({ family_id: familyProfile.id })
    dispatch(handleFamilyAdditonalForm('create', properties, additionalForm, createFamilyAdditonalFormPath))
      .then(response => {
        if (actions.clickForm == 'additionalForm') {
          familyUpdated = mergeStateAdditionalFormInFamily(familyProfile, response.data, additionalForm)
        } else {
          familyUpdated = addFamilyCustomFormState(familyProfile, response.data, additionalForm)
        }
        dispatch(createFamilyCustomFormSuccess(familyUpdated))
        Alert.alert(
          'Message',
          'You have create new additional form successfully.',
          [{ text: 'OK', onPress: () => Navigation.popTo(actions.familyDetailComponentId) }],
          { cancelable: false }
        )
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
  }
}

export function editFamilyAdditionalForm(properties, familyProfile, custom_field, additionalForm, actions) {
  return dispatch => {
    let updateFamilyAdditonalFormPath = _.template(endpoint.createFamilyAdditonalFormPath)
    updateFamilyAdditonalFormPath = updateFamilyAdditonalFormPath({ family_id: familyProfile.id })
    updateFamilyAdditonalFormPath = updateFamilyAdditonalFormPath + '/' + custom_field.id
    dispatch(handleFamilyAdditonalForm('update', properties, additionalForm, updateFamilyAdditonalFormPath))
      .then(response => {
        const familyUpdated = updateStateAdditionalFormInFamily(familyProfile, response.data, additionalForm)
        dispatch(createFamilyCustomFormSuccess(familyUpdated))
        Alert.alert(
          'Message',
          'You have update additional form successfully.',
          [{ text: 'OK', onPress: () => Navigation.popTo(actions.currentComponentId) }],
          { cancelable: false }
        )
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
  }
}

export function deleteFamilyAdditionalForm(customFieldProperty, familyProfile, redirectListAdditionalForms, actions) {
  return dispatch => {
    let deleteFamilyAdditonalFormPath = _.template(endpoint.createFamilyAdditonalFormPath)
    deleteFamilyAdditonalFormPath = deleteFamilyAdditonalFormPath({ family_id: familyProfile.id })
    deleteFamilyAdditonalFormPath = deleteFamilyAdditonalFormPath + '/' + customFieldProperty.id
    axios
      .delete(deleteFamilyAdditonalFormPath)
      .then(response => {
        const familyUpdated = deleteStateAdditionalFormInFamily(familyProfile, customFieldProperty, actions.customForm)
        dispatch(createFamilyCustomFormSuccess(familyUpdated))
        Alert.alert('Message', 'You have delete additional form successfully.')
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
  }
}

export function handleFamilyAdditonalForm(type, properties, additionalForm, EndPoint) {
  return dispatch => {
    let formData = new FormData()
    formData.append('custom_field_id', additionalForm.id)

    additionalForm.fields.map((field, index) => {
      if (formTypes.includes(field.type)) {
        if (field.type == 'file') {
          if (properties[field.label] != undefined && properties[field.label].length > 0) {
            const uniqIndex = Math.floor(Math.random() * 1000000)
            properties[field.label].map(attachment => {
              if (attachment.uri != undefined) {
                formData.append(
                  `custom_field_property[form_builder_attachments_attributes[${uniqIndex}][name]]`,
                  field.name
                )
                formData.append(`custom_field_property[form_builder_attachments_attributes[${uniqIndex}][file]][]`, {
                  uri: attachment.path,
                  name: attachment.name,
                  type: attachment.type
                })
              }
            })
          } else {
            if (type == 'create') {
              formData.append(`custom_field_property[form_builder_attachments_attributes[${index}][name]]`, field.name)
              formData.append(`custom_field_property[form_builder_attachments_attributes[${index}][file]][]`, '')
            }
          }
        } else {
          if (typeof properties[field.label] === 'string') {
            formData.append(`custom_field_property[properties[${field.name}]]`, properties[field.label])
          } else if (typeof properties[field.label] === 'object') {
            if (properties[field.label].length > 0) {
              properties[field.label].map((value, index) => {
                formData.append(`custom_field_property[properties[${field.name}]][]`, value)
              })
            } else {
              formData.append(`custom_field_property[properties[${field.name}]][]`, '')
            }
          }
        }
      }
    })

    if (type == 'create') {
      return axios.post(EndPoint, formData)
    } else {
      return axios.put(EndPoint, formData)
    }
  }
}
