import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Field extends Component {
  render() {
    const { name, value, children } = this.props

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.field}>{name}</Text>
        { children || <Text style={styles.fieldData}>{value}</Text> }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fieldContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF1'
  },
  field: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#009999',
    marginBottom: 5,
  },
  fieldData: {
    fontSize: 18
  }
})
