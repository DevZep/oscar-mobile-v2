import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'

const TaskButton = ({ title, data, onPress, color }) => (
  <TouchableWithoutFeedback onPress={ data > 0 ? onPress : null }>
    <View style={[styles.task, {backgroundColor: data === 0 ? '#888' : color}]}>
      <Text style={styles.number}>{ data }</Text>
      <Text style={styles.title}>{ title }</Text>
    </View>
  </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
  task: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 10,
    elevation: 15,
    shadowOffset:{  width: 5,  height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: 'white'
  },
  number: {
    color: 'white',
    fontSize: 40
  }
})

export default TaskButton