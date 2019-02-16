import React, { Component } from 'react'
import { connect } from 'react-redux'

import EditCustomFormWidget from '../../components/EditCustomFormWidget'
import { editFamilyAdditionalForm } from '../../redux/actions/families'

class EditAdditionalForm extends Component {
  render() {
    return <EditCustomFormWidget {...this.props} />
  }
}

const mapDispatch = {
  editFamilyAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(EditAdditionalForm)
