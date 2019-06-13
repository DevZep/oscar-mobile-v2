import React, { Component }             from 'react'
import { connect }                      from 'react-redux'
import { startTabScreen }               from '../../navigation/config'
import { updatePin, setDefaultHeader }  from '../../redux/actions/auth'
import i18n                             from '../../i18n'
import PinCode                          from '../../components/pin'
import CryptoJS                         from 'crypto-js'
import { fetchTranslations }            from '../../redux/actions/translations'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
class Pin extends Component {
  state = {
    pinCode: this.props.pinCode,
    pinTitle: this.props.pinTitle,
    pinMode: this.props.pinMode
  }

  componentDidMount() {
    this.props.fetchTranslations()
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
        this.props.setDefaultHeader(this.props.user.headers)
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
  updatePin,
  setDefaultHeader,
  fetchTranslations
}

export default connect(
  mapState,
  mapDispatch
)(Pin)
