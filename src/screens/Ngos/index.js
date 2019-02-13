import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Navigation }       from 'react-native-navigation'
import FastImage            from 'react-native-fast-image'
import { fetchNgos }        from '../../redux/actions/ngo'
import { NGO_TYPES }        from '../../redux/types'
import { pushScreen }       from '../../navigation/config'
import styles               from './styles'
import i18n                 from '../../i18n'

import {
  View,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native'

class NgosScreen extends Component {
  componentDidMount() {
    this.props.fetchNgos()
  }

  handleNgoPress(name, logo, sharedImageId) {
    const options = {
      screen: 'oscar.login',
      title: `${i18n.t('auth.login_to')} ${name}`,
      props: { logo, sharedImageId },
      customTransition: {
        animations: [
          { type: 'sharedElement', fromId: sharedImageId, toId: sharedImageId,startDelay: 0, springVelocity: 0.2, duration: 0.5 }
        ],
        duration: 0.8
      }
    }
    this.props.setNgoName(name)
    pushScreen(this.props.componentId, options)
  }

  render() {
    const { ngos, loading } = this.props

    if (loading) return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View>
    )

    return (
      <ScrollView style={styles.container}>
        <View style={styles.bodyContainer}>
          <View style={styles.ngoWrapper}>
            {
              ngos.map((ngo, index) => {
                const ngoLogo = ngo.logo.url
                const ngoName = ngo.short_name
                const sharedElementId = `${index}-'sharedImageId'`
                return (
                  <TouchableHighlight
                    key={index}
                    underlayColor="transparent"
                    onPress={() => this.handleNgoPress(ngoName, ngoLogo, sharedElementId)}
                  >
                    <View style={styles.imageWrapper}>
                      <Navigation.Element
                        style={styles.shareElement}
                        elementId={sharedElementId}
                      >
                          <FastImage
                            resizeMode="contain"
                            style={styles.logo}
                            source={{ uri: ngoLogo }}
                          />
                      </Navigation.Element>
                    </View>
                  </TouchableHighlight>
                )
              })
            }
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapState = (state) => ({
  ngos: state.ngo.data,
  loading: state.ngo.loading
})

const mapDispatch = (dispatch) => ({
  fetchNgos: () => dispatch(fetchNgos()),
  setNgoName: (name) => dispatch({ type: NGO_TYPES.SET_NGO_NAME, name })
})

export default connect(mapState, mapDispatch)(NgosScreen)
