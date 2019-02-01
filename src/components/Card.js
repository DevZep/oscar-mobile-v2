import React from 'react'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { MAIN_COLOR } from '../constants/colors'

const Card = (props) => (
  <View style={[styles.container, props.style]}>
    <View style={[styles.header, { backgroundColor: props.color || MAIN_COLOR }]}>
      <Text style={styles.headerTitle}>
        { props.title }
      </Text>
    </View>
    <View style={styles.content}>
      { props.children }
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    elevation: 15,
    shadowOffset:{  width: 5,  height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  content: {
    backgroundColor: '#fff'
  },
  header: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'flex-start',
    padding: 20
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff'
  }
})

export default Card