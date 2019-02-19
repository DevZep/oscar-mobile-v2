import React, { Component } from 'react'
import EditCustomFormWidget from '../../components/EditCustomFormWidget'
import { connect } from 'react-redux'
import { editAdditionalForm } from '../../redux/actions/customForms'

class EditAdditionalForm extends Component {
  render() {
    return <EditCustomFormWidget {...this.props} />
  }
}

const mapDispatch = {
  editAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(EditAdditionalForm)
