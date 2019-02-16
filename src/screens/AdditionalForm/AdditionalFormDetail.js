import React, { Component } from 'react'

import { connect } from 'react-redux'
import { deleteFamilyAdditionalForm } from '../../redux/actions/families'

import AdditionalFormList from '../../components/AdditionalFormList'

class AdditionalFormDetail extends Component {
  render() {
    return <AdditionalFormList {...this.props} />
  }
}

const mapDispatch = {
  deleteFamilyAdditionalForm
}

export default connect(
  null,
  mapDispatch
)(AdditionalFormDetail)
