import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateCustomFormWidget from '../../components/CreateCustomFormWidget'
import { createAdditionalForm } from '../../redux/actions/customForms'

class CreateCustomForm extends Component {
  render() {
    return <CreateCustomFormWidget {...this.props} />
  }
}

const mapDispatch = {
  createAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(CreateCustomForm)
