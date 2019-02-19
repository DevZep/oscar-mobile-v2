import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import CryptoJS from 'crypto-js'
import { startScreen, startTabScreen } from '../../navigation/config'
import { updatePin } from '../../redux/actions/auth'
import PinCode from '../../components/pin'
import i18n from '../../i18n'

class Pin extends Component {
  state = {
    pinCode: this.props.pinCode,
    pinTitle: this.props.pinTitle,
    pinMode: this.props.pinMode
  }

  verifyCode = (code, clear, vibration) => {
    const { pinMode, pinCode } = this.state
    if (pinMode == 'set') {
      this.setState({
        pinCode: CryptoJS.SHA3(code),
        pinTitle: i18n.t('auth.confirm_pin'),
        pinMode: 'confirm'
      })
      clear()
    } else {
      const newCode = String(CryptoJS.SHA3(code))
      const oldCode = String(pinCode)

      if (newCode == oldCode) {
        pinMode == 'compare' ? startTabScreen() : this.props.updatePin(code)
      } else {
        vibration()
        clear()
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.pinTitle}</Text>
        <PinCode Size={5} eventCode={this.verifyCode} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009999'
  },
  title: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 50
  }
})

const mapState = state => ({
  user: state.auth.data,
  headers: state.auth.headers
})

const mapDispatch = {
  updatePin
}

export default connect(
  mapState,
  mapDispatch
)(Pin)
