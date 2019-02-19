import axios from 'axios'
import { Alert } from 'react-native'
import { FAMILY_TYPES, CLIENT_TYPES } from '../types'
import endpoint from '../../constants/endpoint'
import { formTypes } from '../../utils/validation'
import _ from 'lodash'
import { Navigation } from 'react-native-navigation'

createEntityCustomFormSuccess = (entityUpdated, customFormType) => ({
  type: customFormType,
  entityUpdated
})

customFieldPropertyPath = type => {
  let customFieldPropertyPath = ''
  let types = {}
  if (actions.type == 'client') {
    customFieldPropertyPath = endpoint.createClientAdditonalFormPath
    customFormType = CLIENT_TYPES.CLIENT_CUSTOM_FORM
  } else {
    customFieldPropertyPath = endpoint.createFamilyAdditonalFormPath
    customFormType = FAMILY_TYPES.FAMILY_CUSTOM_FORM
  }
  let deleteEntityAdditonalFormPath = _.template(customFieldPropertyPath)
}

addEntityCustomFormState = (entity, newCustomFieldProperty, form) => {
  form['custom_field_properties'] = [newCustomFieldProperty]
  const updateForms = entity.add_forms.filter(add_form => {
    return add_form.id !== form.id
  })
  entity.add_forms = updateForms
  entity.additional_form = [form, ...entity.additional_form]
  return entity
}

updateStateAdditionalFormInEntity = (entity, updatedCustomFieldProperty, additionalForm) => {
  let newForm = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForm = _.map(entity.additional_form, form => {
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
    entity.additional_form = newForm
  }
  return entity
}

mergeStateAdditionalFormInEntity = (entity, newCustomFieldProperty, additionalForm) => {
  let newForm = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForm = _.map(entity.additional_form, form => {
      if (form.id === newCustomFieldProperty.custom_field_id) {
        form.custom_field_properties = [newCustomFieldProperty, ...form.custom_field_properties]
        return form
      }
      return form
    })
    entity.additional_form = newForm
  }
  return entity
}

deleteStateAdditionalFormInEntity = (entity, deletedCustomFieldProperty, additionalForm) => {
  let newAddForms = []
  let newAdditionalForms = []
  let newForms = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForms = _.map(entity.additional_form, form => {
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
    newAdditionalForms = _.filter(entity.additional_form, additional_form => {
      return additional_form.id != customFormDeleted.id
    })
    return {
      ...entity,
      additional_form: newAdditionalForms,
      add_forms: [...newAddForms, ...entity.add_forms]
    }
  }

  return {
    ...entity,
    additional_form: newForms
  }
}

customFormPropertyPathAndType = type => {
  let customFieldPropertyPath = ''
  let customFormType = ''
  if (type == 'client') {
    customFieldPropertyPath = endpoint.createClientAdditonalFormPath
    customFormType = CLIENT_TYPES.CLIENT_CUSTOM_FORM
  } else {
    customFieldPropertyPath = endpoint.createFamilyAdditonalFormPath
    customFormType = FAMILY_TYPES.FAMILY_CUSTOM_FORM
  }
  return { customFieldPropertyPath, customFormType }
}

export function createAdditionalForm(properties, entityProfile, additionalForm, actions) {
  return dispatch => {
    const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)

    let entityUpdated = {}
    let createEntityAdditonalFormPath = _.template(customFieldPropertyPath)
    createEntityAdditonalFormPath = createEntityAdditonalFormPath({ entity_id: entityProfile.id })
    dispatch(handleEntityAdditonalForm('create', properties, additionalForm, createEntityAdditonalFormPath))
      .then(response => {
        if (actions.clickForm == 'additionalForm') {
          entityUpdated = mergeStateAdditionalFormInEntity(entityProfile, response.data, additionalForm)
        } else {
          entityUpdated = addEntityCustomFormState(entityProfile, response.data, additionalForm)
        }
        dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
        Alert.alert(
          'Message',
          'You have create new additional form successfully.',
          [{ text: 'OK', onPress: () => Navigation.popTo(actions.entityDetailComponentId) }],
          { cancelable: false }
        )
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
  }
}

export function editAdditionalForm(properties, entityProfile, custom_field, additionalForm, actions) {
  return dispatch => {
    const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
    let updateEntityAdditonalFormPath = _.template(customFieldPropertyPath)
    updateEntityAdditonalFormPath = updateEntityAdditonalFormPath({ entity_id: entityProfile.id })
    updateEntityAdditonalFormPath = updateEntityAdditonalFormPath + '/' + custom_field.id
    dispatch(handleEntityAdditonalForm('update', properties, additionalForm, updateEntityAdditonalFormPath))
      .then(response => {
        const entityUpdated = updateStateAdditionalFormInEntity(entityProfile, response.data, additionalForm)
        dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
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

export function deleteAdditionalForm(customFieldProperty, entityProfile, actions) {
  return dispatch => {
    const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
    let deleteEntityAdditonalFormPath = _.template(customFieldPropertyPath)
    deleteEntityAdditonalFormPath = deleteEntityAdditonalFormPath({ entity_id: entityProfile.id })
    deleteEntityAdditonalFormPath = deleteEntityAdditonalFormPath + '/' + customFieldProperty.id
    axios
      .delete(deleteEntityAdditonalFormPath)
      .then(response => {
        const entityUpdated = deleteStateAdditionalFormInEntity(entityProfile, customFieldProperty, actions.customForm)
        dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
        Alert.alert('Message', 'You have delete additional form successfully.')
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
  }
}

export function handleEntityAdditonalForm(type, properties, additionalForm, EndPoint) {
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
