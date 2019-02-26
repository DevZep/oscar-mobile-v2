import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button'
import DropdownAlert from 'react-native-dropdownalert'
import { login } from '../../redux/actions/auth'
import styles from './style'
import i18n from '../../i18n'

import { View, Text, Image, TextInput, KeyboardAvoidingView, Vibration } from 'react-native'

class LoginContainer extends Component {
  state = {
    email: '',
    password: '',
    secureTextEntry: true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.displayError(nextProps.error)
    }
  }

  loginHandler() {
    const { email, password } = this.state
    if (!email || !password) this.displayError('Please input email/password')
    else this.props.login({ email, password }, this.props.componentId)
  }

  displayError = error => {
    this.refs.dropdown.alertWithType('error', 'Error', error)
    setTimeout(() => Vibration.vibrate(1000), 300)
  }

  render() {
    const { user, error, loading } = this.props
    const { email, password, secureTextEntry } = this.state

    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.imageWrapper}>
          <Navigation.Element elementId={this.props.sharedImageId}>
            <Image resizeMode="contain" style={styles.image} source={{ uri: this.props.logo }} />
          </Navigation.Element>
        </View>
        <TextInput
          value={email}
          autoCapitalize="none"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#ccc"
          placeholder={i18n.t('auth.email')}
          onSubmitEditing={() => this.refs.password.focus()}
          returnKeyType="next"
          onChangeText={email => this.setState({ email })}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            value={password}
            autoCapitalize="none"
            ref="password"
            style={[styles.input, { flex: 1 }]}
            placeholderTextColor="#ccc"
            secureTextEntry={secureTextEntry}
            placeholder={i18n.t('auth.password')}
            returnKeyType="done"
            onSubmitEditing={() => this.loginHandler()}
            onChangeText={password => this.setState({ password })}
          />
          <Icon
            onPress={() => this.setState({ secureTextEntry: !secureTextEntry })}
            name={secureTextEntry ? 'ios-eye' : 'ios-eye-off'}
            size={30}
            style={styles.showPassword}
          />
        </View>
        <Button isLoading={loading} isDisabled={loading} style={styles.loginButton} textStyle={{ color: '#fff' }} onPress={() => this.loginHandler()}>
          {i18n.t('auth.login')}
        </Button>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </KeyboardAvoidingView>
    )
  }
}

const mapState = state => ({
  user: state.auth.data,
  loading: state.auth.loading,
  error: state.auth.error
})

const mapDispatch = {
  login
}

export default connect(
  mapState,
  mapDispatch
)(LoginContainer)
