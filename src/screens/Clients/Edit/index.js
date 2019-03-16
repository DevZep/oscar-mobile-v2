import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import ClientForm from '../../../components/ClientForm'
import { updateClientProperty } from '../../../redux/actions/clients'

class EditClient extends Component {
  render() {
    return <ClientForm {...this.props} />
  }
}

const mapState = state => ({
  birthProvinces: state.birthProvinces.data,
  provinces: state.provinces.data,
  districts: state.districts.data,
  communes: state.communes.data,
  villages: state.villages.data,
  donors: state.donors.data,
  referralSources: state.referralSources.data,
  quantitativeTypes: state.quantitativeTypes.data,
  users: state.users.data,
  agencies: state.agencies.data,
  error: state.clients.error
})

const mapDispatch = {
  updateClientProperty
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 5
  }
})

export default connect(
  mapState,
  mapDispatch
)(EditClient)
