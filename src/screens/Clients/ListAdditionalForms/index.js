import React, { Component } from 'react'
import { View, Text, ScrollView, ListView, StyleSheet, FlatList } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { pushScreen } from '../../../navigation/config'
import appIcon from '../../../utils/Icon'
import { connect } from 'react-redux'

class AdditionalForm extends Component {
  async createCustomForm(customForm) {
    const icons = await appIcon()
    Navigation.push(this.props.componentId, {
      component: {
        name: 'oscar.additionalFormDetail',
        passProps: {
          clientId: this.props.client.id,
          customFormId: customForm.id,
          listAddtionalFormComponentId: this.props.componentId,
          type: 'client'
        },
        options: {
          bottomTabs: {
            visible: false
          },
          topBar: {
            title: {
              text: customForm.form_title
            },
            backButton: {
              showTitle: false
            },
            rightButtons: [
              {
                id: 'ADD_CUSTOM_FORM',
                icon: icons.add,
                color: '#fff'
              }
            ]
          }
        }
      }
    })
  }

  renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.form_title == ' ' ? '(unknow)' : item.form_title}
      onPress={() => this.createCustomForm(item)}
    />
  )

  keyExtractor = (item, index) => item.id.toString()

  render() {
    const { client } = this.props
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContainer}>
        {client.additional_form.length > 0 ? (
          <View style={styles.container}>
            <FlatList data={client.additional_form} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data</Text>
          </View>
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  noDataText: {
    fontSize: 20,
    color: '#c52f24'
  }
})

const mapState = (state, ownProps) => ({
  client: state.clients.data[ownProps.clientId]
})

export default connect(mapState)(AdditionalForm)
