import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

export default class Field extends Component {
  render() {
    const { name, value } = this.props

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.field}>
          {name}
        </Text>
        <Text style={styles.fieldData}>{value}</Text>
      </View>
    )
  }
}
