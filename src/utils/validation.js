import { Alert } from 'react-native'
import _ from 'lodash'

export const formTypes = ['checkbox-group', 'textarea', 'date', 'text', 'number', 'radio-group', 'select', 'file']

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function disabledUpload() {
  return false
}

export function validateProgramStreamForm(
  status,
  type,
  field_properties,
  enrollment,
  program_stream,
  client_enrolled_programs_id,
  client_id,
  exit_date,
  enrollment_date,
  actions
) {
  let enrollmentFormFields = []
  if (type == 'Exit') {
    enrollmentFormFields = enrollment.leave_program_field
  } else if (type == 'Enroll') {
    enrollmentFormFields = enrollment.enrollment_field
  } else {
    enrollmentFormFields = enrollment.tracking_field
  }

  const formrequired = _.filter(enrollmentFormFields, field => {
    return field.required && _.isEmpty(field_properties[field.label])
  })

  const numberBetween = _.filter(enrollmentFormFields, field => {
    if (field.type == 'number' && field_properties[field.label] != '') {
      if (field.max != undefined && field.min != undefined) {
        return !(
          parseFloat(field.min) <= parseFloat(field_properties[field.label]) &&
          parseFloat(field_properties[field.label]) <= parseFloat(field.max)
        )
      } else if (field.max != undefined && field.min == undefined) {
        return parseFloat(field_properties[field.label]) > parseFloat(field.max)
      } else if (field.max == undefined && field.min != undefined) {
        return parseFloat(field_properties[field.label]) < parseFloat(field.min)
      }
    }
  })

  const emailValidation = _.filter(enrollmentFormFields, field => {
    if (field.type == 'text' && field.subtype == 'email' && field_properties[field.label] != '') {
      return !validateEmail(field_properties[field.label])
    }
  })

  if (formrequired.length + numberBetween.length + emailValidation.length == 0) {
    if (type == 'Exit') {
      if (status == 'update') {
        actions.updateLeaveProgram(
          type,
          field_properties,
          enrollment,
          client_enrolled_programs_id,
          client_id,
          enrollment.id,
          exit_date,
          actions
        )
      }
    } else if (type == 'Enroll') {
      if (status == 'update') {
        actions.updateEnrolledProgram(
          type,
          field_properties,
          enrollment,
          client_enrolled_programs_id,
          client_id,
          enrollment_date,
          actions
        )
      }
    } else {
      if (status == 'update') {
        actions.updateTrackingEnrolledProgram(
          type,
          field_properties,
          enrollment,
          client_id,
          enrollment.client_enrollment_id,
          enrollment.id,
          actions
        )
      }
    }
  } else {
    let message = ''
    if (formrequired.length > 0) {
      message = `${formrequired[0].label} is required.`
    } else if (numberBetween.length > 0) {
      const field = numberBetween[0]
      if (field.min != undefined && field.max != undefined) {
        message = `${field.label} cannot be ${
          parseFloat(field_properties[field.label]) < parseFloat(field.min)
            ? 'lower then ' + field.min
            : 'greater then ' + field.max
        }`
      } else if (field.min != undefined && field.max == undefined) {
        message = `${field.label} cannot be lower than ${field.min}`
      } else if (field.min == undefined && field.max != undefined) {
        message = `${field.label} cannot be greater than ${field.max}`
      }
    } else if (emailValidation.length > 0) {
      message = `${emailValidation[0].label} is not an email`
    }
    Alert.alert('Warning', message)
  }
}

export function validateAdditonalForm(status, properties, client, custom_field, additionalForm, actions) {
  const formrequired = _.filter(additionalForm.fields, field => {
    return field.required && _.isEmpty(properties[field.label])
  })

  const numberBetween = _.filter(additionalForm.fields, field => {
    if (field.type == 'number' && properties[field.label] != '') {
      if (field.max != undefined && field.min != undefined) {
        return !(
          parseFloat(field.min) <= parseFloat(properties[field.label]) &&
          parseFloat(properties[field.label]) <= parseFloat(field.max)
        )
      } else if (field.max != undefined && field.min == undefined) {
        return parseFloat(properties[field.label]) > parseFloat(field.max)
      } else if (field.max == undefined && field.min != undefined) {
        return parseFloat(properties[field.label]) < parseFloat(field.min)
      }
    }
  })

  const emailValidation = _.filter(additionalForm.fields, field => {
    if (field.type == 'text' && field.subtype == 'email' && properties[field.label] != '') {
      return !validateEmail(properties[field.label])
    }
  })

  if (formrequired.length + numberBetween.length + emailValidation.length == 0) {
    if (status == 'update') {
      actions.editAdditionalForm(properties, client, custom_field, additionalForm, actions)
    } else {
      actions.createAdditionalForm(properties, client, additionalForm, actions)
    }
  } else {
    let message = ''
    if (formrequired.length > 0) {
      message = `${formrequired[0].label} is required.`
    } else if (numberBetween.length > 0) {
      const field = numberBetween[0]
      if (field.min != undefined && field.max != undefined) {
        message = `${field.label} cannot be ${
          parseFloat(properties[field.label]) < parseFloat(field.min)
            ? 'lower then ' + field.min
            : 'greater then ' + field.max
        }`
      } else if (field.min != undefined && field.max == undefined) {
        message = `${field.label} cannot be lower than ${field.min}`
      } else if (field.min == undefined && field.max != undefined) {
        message = `${field.label} cannot be greater than ${field.max}`
      }
    } else if (emailValidation.length > 0) {
      message = `${emailValidation[0].label} is not an email`
    }
    Alert.alert('Warning', message)
  }
}

export function validateCustomForm(field_properties, fields) {
  const formrequired = _.filter(fields, field => {
    return field.required && _.isEmpty(field_properties[field.label])
  })

  const numberBetween = _.filter(fields, field => {
    if (field.type == 'number' && field_properties[field.label] != '') {
      if (field.max != undefined && field.min != undefined) {
        return !(
          parseFloat(field.min) <= parseFloat(field_properties[field.label]) &&
          parseFloat(field_properties[field.label]) <= parseFloat(field.max)
        )
      } else if (field.max != undefined && field.min == undefined) {
        return parseFloat(field_properties[field.label]) > parseFloat(field.max)
      } else if (field.max == undefined && field.min != undefined) {
        return parseFloat(field_properties[field.label]) < parseFloat(field.min)
      }
    }
  })

  const emailValidation = _.filter(fields, field => {
    if (field.type == 'text' && field.subtype == 'email' && field_properties[field.label] != '') {
      return !validateEmail(field_properties[field.label])
    }
  })

  if (formrequired.length + numberBetween.length + emailValidation.length == 0) {
    return true
  } else {
    let message = ''
    if (formrequired.length > 0) {
      message = `${formrequired[0].label} is required.`
    } else if (numberBetween.length > 0) {
      const field = numberBetween[0]
      if (field.min != undefined && field.max != undefined) {
        message = `${field.label} cannot be ${
          parseFloat(field_properties[field.label]) < parseFloat(field.min)
            ? 'lower then ' + field.min
            : 'greater then ' + field.max
        }`
      } else if (field.min != undefined && field.max == undefined) {
        message = `${field.label} cannot be lower than ${field.min}`
      } else if (field.min == undefined && field.max != undefined) {
        message = `${field.label} cannot be greater than ${field.max}`
      }
    } else if (emailValidation.length > 0) {
      message = `${emailValidation[0].label} is not an email`
    }
    Alert.alert('Warning', message)
    return false
  }
}
