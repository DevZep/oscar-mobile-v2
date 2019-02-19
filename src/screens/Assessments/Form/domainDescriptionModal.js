import React, { Component } from "react"
import { View, ScrollView } from "react-native"
import { Navigation } from 'react-native-navigation'
import HTMLView from "react-native-htmlview"
import Button from "apsl-react-native-button"

export default class AssessmentDescriptionDetail extends Component {
  render() {
    const { domain } = this.props
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
          <HTMLView
            value={
              domain.description
              .replace(new RegExp('\n', 'g'), '')
              .replace(new RegExp('<p>&nbsp</p>', 'g'), '')
            }
          />
        </ScrollView>
        <Button
          style={{height: 40, marginBottom: 0, borderWidth: 1, borderColor: '#00B8D4', backgroundColor: '#00B8D4', borderRadius: 0}}
          textStyle={{color: '#fff'}}
          onPress={() => Navigation.dismissAllModals({})}
        >
          OK
        </Button>
      </View>
    )
  }
}