import React, { Component }     from 'react'
import Icon                     from 'react-native-vector-icons/Ionicons'
import appIcon                  from '../../../utils/Icon'
import DropdownAlert            from 'react-native-dropdownalert'
import { connect }              from 'react-redux'
import { pushScreen }           from '../../../navigation/config'
import { filter, find }         from 'lodash'
import { listTracking }         from '../../../styles'
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
class ListTracking extends Component {
  async renderCreateTackingForm(tracking, programStream) {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.trackingForm',
      title: tracking.name,
      props: {
        tracking: tracking,
        programStream: programStream,
        client: this.props.client,
        listTrackingComponentId: this.props.componentId,
        action: 'create',
        alertMessage: this.alertMessage
      },
      rightButtons: [
        {
          id: 'SAVE_TRACKING',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  async _renderTrackingReport(tracking) {
    const { programStream } = this.props
    const icons = await appIcon()
    const activeEnrollment = find(programStream.enrollments, { status: 'Active' })
    let trackingsEnrolled = activeEnrollment.trackings
    let filterTrackings = []

    if (trackingsEnrolled.length > 0) {
      filterTrackings = filter(trackingsEnrolled, { tracking_id: tracking.id })
    }

    if (filterTrackings.length > 0) {
      pushScreen(this.props.componentId, {
        screen: 'oscar.trackingDetail',
        title: `${tracking.name} - ${programStream.name}`,
        props: {
          enrollmentId: activeEnrollment.id,
          tracking: tracking,
          clientId: this.props.client.id,
          programStreamId: programStream.id,
          clickForm: this.props.clickForm
        },
        rightButtons: [
          {
            id: 'ADD_TRACKING',
            icon: icons.add,
            color: '#fff'
          }
        ]
      })
    } else {
      this.refs.dropdown.alertWithType('info', 'Info', 'No tracking report')
    }
  }

  alertMessage = () => {
    this.refs.dropdown.alertWithType('success', 'Success', 'Tracking has been successfully created.')
  }

  render() {
    const { programStream, translations } = this.props
    const trackingTranslation = translations.datagrid.columns.trackings
    return (
      <View style={{flex: 1}}>
        <View style={listTracking.container}>
          <View style={listTracking.tableWrapper}>
            <View style={[listTracking.tableRow, listTracking.tableHeader]}>
              <View style={listTracking.headerColumn}>
                <Text style={listTracking.headerLabel}>{trackingTranslation.name}</Text>
              </View>
              <View style={listTracking.headerColumn}>
                <Text style={listTracking.headerLabel}>{trackingTranslation.frequency}</Text>
              </View>
              <View style={listTracking.headerColumn}>
                <Text style={listTracking.headerLabel}>{trackingTranslation.report}</Text>
              </View>
              <View style={listTracking.headerColumn}>
                <Text style={listTracking.headerLabel}>{trackingTranslation.action}</Text>
              </View>
            </View>
            <ScrollView>
              {programStream.tracking_fields.map((tracking, index) => {
                return (
                  <View key={index} style={[listTracking.tableDetailRow, listTracking.tableRow]}>
                    <View style={listTracking.column}>
                      <Text style={listTracking.detailLabel}>{tracking.name}</Text>
                    </View>
                    <View style={listTracking.column}>
                      <Text style={listTracking.detailLabel}>{tracking.frequency}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this._renderTrackingReport(tracking)}>
                      <View style={listTracking.column}>
                        <Icon name="ios-eye" size={25} style={[listTracking.detailLabel, { color: '#009999' }]} />
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.renderCreateTackingForm(tracking, programStream)}>
                      <View style={listTracking.column}>
                        <Icon name="md-add-circle" size={25} style={[listTracking.detailLabel, { color: '#009999' }]} />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => {
  const client = state.clients.data[ownProps.clientId]
  const programStream = find(client.program_streams, { id: ownProps.programStreamId })
  const language = state.language.language
  const translations = state.translations.data[language]
  return { client, programStream, translations }
}

export default connect(mapState)(ListTracking)
