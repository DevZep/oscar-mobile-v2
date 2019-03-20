import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import { View, Image, Platform, NetInfo } from 'react-native'
import { connect } from 'react-redux'
import KeyboardManager from 'react-native-keyboard-manager'
import Database from '../../config/Database'
import logo from '../../assets/oscar-logo.png'
import styles from './styles'
import i18n from '../../i18n'
import { LANGUAGE_TYPES } from '../../redux/types'
import { checkConnection } from '../../redux/actions/internet'
import { startNgoScreen, startScreen } from '../../navigation/config'
import { setDefaultHeader, verifyUser } from '../../redux/actions/auth'
class SplashScreen extends Component {
  static options(passProps) {
    return {
      statusBar: {
        style: Platform.OS === 'ios' ? 'dark' : 'light'
      }
    }
  }

  constructor(props) {
    super(props)
    props.checkConnection()
  }

  componentDidMount() {
    this.setLanguage()
    Platform.OS == 'ios' && KeyboardManager.setEnableAutoToolbar(false)
    NetInfo.addEventListener('connectionChange', this.props.checkConnection)
    setTimeout(() => this.authenticateUser(), 1500)
  }

  setLanguage = () => {
    const languageSetting = Database.objects('Setting').filtered('key = $0', 'language')[0]
    if (languageSetting.value !== null) {
      this.props.setLanguage(languageSetting.value)
    }
  }

  goToPinScreen = pinCode => {
    startScreen('oscar.pin', {
      pinTitle: pinCode ? i18n.t('auth.enter_pin') : i18n.t('auth.set_pin'),
      pinMode: pinCode ? 'compare' : 'set',
      pinCode: pinCode
    })
  }

  authenticateUser = () => {
    const { user, verifyUser, hasInternet } = this.props
    if (user == null) {
      startNgoScreen()
    } else {
      if (hasInternet) {
        verifyUser(this.goToPinScreen)
      } else {
        const pinCode = CryptoJS.SHA3(user.pin_code)
        this.goToPinScreen(pinCode)
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
      </View>
    )
  }
}

const mapState = state => ({
  user: state.auth.data,
  hasInternet: state.internet.hasInternet
})

const mapDispatch = dispatch => ({
  setLanguage: language =>
    dispatch({
      type: LANGUAGE_TYPES.SET_LANGUAGE,
      language
    }),
  verifyUser: action => dispatch(verifyUser(action)),
  setDefaultHeader: () => dispatch(setDefaultHeader()),
  checkConnection: () => dispatch(checkConnection())
})

export default connect(
  mapState,
  mapDispatch
)(SplashScreen)
