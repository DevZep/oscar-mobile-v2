import React, { Component } from 'react'
import { Alert }            from 'react-native'
import { connect }          from 'react-redux'
import { LANGUAGE_TYPES }   from '../../redux/types'
import Database             from '../../config/Database'
import RNRestart            from 'react-native-restart'
import i18n                 from '../../i18n'
import FastImage            from 'react-native-fast-image'

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

class LanguageScreen extends Component {
  updateLanguage(language) {
    Alert.alert(
      '',
      i18n.t('language.restart_now'),
      [
        { text: i18n.t('language.yes'), onPress: () => this.setLanguage(language) },
        { text: i18n.t('language.no'), style: 'cancel' }
      ],
      { cancelable: false }
    )
  }

  setLanguage = (language) => {
    this.props.setLanguage(language)

    const languageSetting = Database.objects('Setting').filtered('key = $0', 'language')[0]
    Database.write(() => { languageSetting.value = language })
    RNRestart.Restart()
  }

  getLanguageObject = {
    en: {
      title: 'English',
      flag: require('../../assets/en.png')
    },
    km: {
      title: 'ភាសាខ្មែរ',
      flag: require('../../assets/km.png')
    },
    my: {
      title: 'မြန်မာစာ',
      flag: require('../../assets/my.png')
    },
  }

  renderLanguageButton = (abbr) => {
    const isActive = abbr === this.props.language
    const language = this.getLanguageObject[abbr]
    return (
      <TouchableOpacity onPress={ () => this.updateLanguage(abbr) }>
        <View style={[ styles.languageWrapper, isActive ? styles.active : {} ]}>
          <Text style={[ styles.languageTitle, isActive ? styles.activeText : {} ]}>
            { language.title }
          </Text>
          <FastImage source={ language.flag } style={ styles.flag }/>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={ styles.container }>
        { this.renderLanguageButton('en') }
        { this.renderLanguageButton('km') }
        { this.renderLanguageButton('my') }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageWrapper: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  flag: {
    width: 50,
    height: 35
  },
  active: {
    backgroundColor: '#009999'
  },
  activeText: {
    color: '#fff'
  }
})

const mapState = (state) => ({
  language: state.language.language
})

const mapDispatch = (dispatch) => ({
  setLanguage: (language) => dispatch({
    type: LANGUAGE_TYPES.SET_LANGUAGE,
    language
  })
})

export default connect(mapState, mapDispatch)(LanguageScreen)
