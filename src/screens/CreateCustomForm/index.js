import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateCustomFormWidget from '../../components/CreateCustomFormWidget'
import { createFamilyAdditionalForm } from '../../redux/actions/families'

class CreateCustomForm extends Component {
  render() {
    return <CreateCustomFormWidget {...this.props} />
  }
}

const mapDispatch = {
  createFamilyAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(CreateCustomForm)
