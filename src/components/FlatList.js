import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, View, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native'

export default class OscarFlatList extends Component {
  keyExtractor = (item, _) => item.id.toString()

  renderIcon = () => {
    if (this.props.isClientList) return <Icon name={'account-circle'} color="#dedede" size={55} />
    else
      return (
        <View style={styles.iconWrapper}>
          <Icon name="group" color="#fff" size={46} style={{ padding: 2 }} />
        </View>
      )
  }

  renderItem = ({ item }) => (
    <TouchableWithoutFeedback key={item.id} onPress={() => this.props.onPress && this.props.onPress(item)}>
      <View style={styles.wrapper}>
        {this.renderIcon()}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{this.props.title(item)}</Text>
          {this.props.subItems(item).map((subItem, index) => (
            <View key={index} style={styles.subItemWrapper}>
              <Icon name="label" color="#009999" size={18} style={styles.labelIcon} />
              <Text style={{ color: '#009999' }}>{subItem}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexWrap: 'wrap' }}>
          <Icon name="navigate-next" size={33} color="grey" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )

  render() {
    const data = Object.values(this.props.data)
    return <FlatList data={data} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    flex: 1
  },
  titleWrapper: {
    marginLeft: 12,
    flexWrap: 'wrap',
    flex: 1
  },
  title: {
    fontWeight: 'bold'
  },
  subItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    padding: 1
  },
  labelIcon: {
    marginRight: 4
  },
  iconWrapper: {
    backgroundColor: '#dedede',
    borderRadius: 30,
    padding: 2
  }
})
