import React, { Component } from 'react'

import { connect } from 'react-redux'
import { deleteAdditionalForm } from '../../redux/actions/customForms'

import AdditionalFormList from '../../components/AdditionalFormList'

class AdditionalFormDetail extends Component {
  render() {
    return <AdditionalFormList {...this.props} />
  }
}

const mapDispatch = {
  deleteAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(AdditionalFormDetail)
