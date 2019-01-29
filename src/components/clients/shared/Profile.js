import React, { Component } from 'react'
import { View, Text, Image, TouchableWithoutFeedback, Alert, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-picker'

const MAX_LENGTH = Dimensions.get('window').width - 180

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 1,
      height: 1,
      loading: false
    }
  }

  options() {
    return {
      noData: true,
      title: 'Select Profile',
      storageOptions: {
        cameraRoll: true,
        waitUntilSaved: true
      }
    }
  }

  updateImageSize() {
    Image.getSize(this.props.image.uri, ( imgWidth, imgHeight ) => {
      const radio  = imgWidth / imgHeight
      const width  = imgWidth > imgHeight ? MAX_LENGTH : (MAX_LENGTH * radio)
      const height = imgWidth > imgHeight ? (MAX_LENGTH / radio) : MAX_LENGTH

      this.setState({ width, height })
    }, alert)
  }

  renderPlaceholder() {
    return (
      <View style={[styles.previewer, styles.placeholder]}>
        <Icon name='add-circle' size={60} color='#009999'/>
      </View>
    )
  }

  renderImage() {
    const { width, height, loading } = this.state
    const { image } = this.props

    return (
      <View style={styles.previewer}>
        {
          loading
          ? <ActivityIndicator color='#009999' size='large'/>
          : <Image
              style={[{ width, height }]}
              source={{ uri: image.uri }}
              onLoad={() => this.updateImageSize()}
            />
        }
      </View>
    )
  }

  upload() {
    if (!this.props.editable) return

    ImagePicker.showImagePicker(this.options(), response => {
      if (response.didCancel) {
      } else if (response.error) {
        Alert.alert('ImagePicker Error', response.error)
      } else {
        this.handleSelectedFile(response)
      }
    })
  }

  handleSelectedFile(response) {
    const fileSize = response.fileSize
    let type = response.type
    if(type == null) {
      type = response.fileName.substring(response.fileName.lastIndexOf('.') + 1)
      type = `image/${type}`
    }
    if (fileSize / 1024 <= 5120) {
      const filePath = response.path != undefined ? `file://${response.path}` : response.uri
      const image = {
        path: filePath,
        uri: response.uri,
        name: response.fileName,
        type: type,
        size: fileSize / 1024
      }

      this.props.onChange('profile', image)
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 5MB upload per request.')
    }
  }

  render() {
    const { image = {} } = this.props
    const { uri } = image

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={ () => this.upload() }>
          { !!uri ? this.renderImage() : this.renderPlaceholder() }
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  previewer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    borderWidth: 1,
    borderColor: '#009999',
    height: MAX_LENGTH,
    width: MAX_LENGTH,
  }
})

export default Profile