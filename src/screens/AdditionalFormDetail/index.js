import React, { Component } from 'react'

import { connect } from 'react-redux'
import { deleteAdditionalForm } from '../../redux/actions/customForms'

import AdditionalFormDetailList from '../../components/AdditionalFormDetailList'

class AdditionalFormDetail extends Component {
  render() {
    return <AdditionalFormDetailList {...this.props} />
  }
}

const mapDispatch = {
  deleteAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(AdditionalFormDetail)
