import React  from 'react'

import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native'

const Menu = (props) => (
  <TouchableWithoutFeedback onPress={ props.disabled ? null : props.onPress}>
    <View style={ [styles.widgetComponent, { backgroundColor: props.disabled ? '#dedede' : props.color }] }>
      {
        props.loading
          ? <ActivityIndicator style={{ marginBottom: 15 }} color='#fff'/>
          : <Text style={styles.itemValue}> { props.value } </Text>
      }
      <Text style={styles.itemTitle}>
        { props.title }
      </Text>
    </View>
  </TouchableWithoutFeedback>
)


const styles = StyleSheet.create({
  widgetComponent: {
    flex: 1,
    height: 80,
    elevation: 15,
    shadowOffset:{  width: 5,  height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  itemValue: {
    color: '#fff',
    fontSize: 25,
    paddingBottom: 5,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 11
  }
})

export default Menu