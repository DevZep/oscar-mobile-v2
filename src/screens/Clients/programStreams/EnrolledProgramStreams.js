import React, { Component } from 'react'
import i18n                       from '../../../i18n'
import appIcon                    from '../../../utils/Icon'
import DropdownAlert              from 'react-native-dropdownalert'
import { connect }                from 'react-redux'
import { Divider }                from 'react-native-elements'
import { pushScreen }             from '../../../navigation/config.js'
import { map, filter }            from 'lodash'
import { programStreamStyles }    from '../../../styles'
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
class ProgramStreams extends Component {
  _viewEnrollmentReport(programStream) {
    pushScreen(this.props.componentId, {
      screen: 'oscar.programStreamDetail',
      title: programStream.name,
      props: {
        programStreamId: programStream.id,
        clientId: this.props.client.id,
        clickForm: 'EnrolledProgram',
        clientDetailComponentId: this.props.clientDetailComponentId
      }
    })
  }

  async _renderExitForm(programStream) {
    const icons = await appIcon()
    const translations = this.props.translations
    const leaveProgramTranslations = translations.leave_enrolled_programs
    pushScreen(this.props.componentId, {
      screen: 'oscar.exitForm',
      title: leaveProgramTranslations.new.new_exit_program,
      props: {
        programStream: programStream,
        client: this.props.client,
        programStreams: this.props.programStreams,
        clientDetailComponentId: this.props.clientDetailComponentId,
        alertMessage: this.props.alertMessage
      },
      rightButtons: [
        {
          id: 'SAVE_EXIT_FORM',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  _renderTrackingForm(programStream) {
    if (!programStream.tracking_required) {
      pushScreen(this.props.componentId, {
        screen: 'oscar.listTracking',
        title: programStream.name,
        props: {
          programStreamId: programStream.id,
          clientId: this.props.client.id,
          clickForm: 'EnrolledProgram'
        }
      })
    }
  }

  render() {
    const { programStreams } = this.props
    const { translations } = this.props
    const clientEnrollmentTranslations = translations.client_enrollments
    const indexTranslations = clientEnrollmentTranslations.index
    const reportTranslations = clientEnrollmentTranslations.report
    if (programStreams == 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{i18n.t('no_data')}</Text>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      )
    }

    return (
      <ScrollView style={programStreamStyles.mainContainer}>
        {map(programStreams, programStream => {
          const activeEnrollments = filter(programStream.enrollments, enrollment => {
            return enrollment.status == 'Active'
          })
          return map(activeEnrollments, (enrollment, index) => {
            return (
              <View key={index} style={programStreamStyles.container}>
                <View style={programStreamStyles.leftSide}>
                  <View style={programStreamStyles.leftSideWrapper}>
                    <View style={programStreamStyles.statusWrapper}>
                      <Text style={programStreamStyles.statusTitle}>{enrollment.status}</Text>
                    </View>
                    <Text style={programStreamStyles.programStreamTitle}>{programStream.name}</Text>

                    <Divider style={programStreamStyles.titleDivider} />

                    <View style={programStreamStyles.quantityWrapper}>
                      <Text style={programStreamStyles.quantityKey}>{indexTranslations.quantity}:</Text>
                      <Text style={programStreamStyles.quantityValue}>{programStream.quantity}</Text>
                    </View>

                    <View style={programStreamStyles.domainWrapper}>
                      <Text style={programStreamStyles.domainKey}>{indexTranslations.domain}:</Text>
                      <View style={programStreamStyles.domainValue}>
                        {map(programStream.domain, (domain, dIndex) => {
                          return (
                            <View key={dIndex} style={programStreamStyles.domainValueButtonWrapper}>
                              <Text style={programStreamStyles.domainValueButton}>{domain}</Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                </View>

                <View style={programStreamStyles.rightSide}>
                  <TouchableWithoutFeedback onPress={() => this._viewEnrollmentReport(programStream)}>
                    <View style={programStreamStyles.buttonWrapper}>
                      <Text style={programStreamStyles.buttonTitle}>{reportTranslations.view}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this._renderTrackingForm(programStream)}>
                    <View
                      style={
                        programStream.tracking_required ? programStreamStyles.buttonWrapperNotTracking : programStreamStyles.buttonWrapperTracking
                      }
                    >
                      <Text style={programStream.tracking_required ? programStreamStyles.buttonTitleTracking : programStreamStyles.buttonTitle}>
                        {reportTranslations.tracking}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this._renderExitForm(programStream)}>
                    <View
                      style={
                        programStream.is_offline != undefined
                          ? [programStreamStyles.buttonWrapperNotTracking, { borderTopWidth: 1, borderTopColor: '#fff' }]
                          : programStreamStyles.buttonWrapper
                      }
                    >
                      <Text
                        style={
                          programStreamStyles.is_offline != undefined ? programStreamStyles.buttonTitleTracking : programStreamStyles.buttonTitle
                        }
                      >
                        {reportTranslations.exit}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )
          })
        })}
      </ScrollView>
    )
  }
}

const mapState = (state, ownProps) => {
  const client = state.clients.data[ownProps.clientId]
  const programStreams = client.program_streams
  const language = state.language.language
  const translations = state.translations.data[language]
  return { client, programStreams, translations }
}

export default connect(mapState)(ProgramStreams)
