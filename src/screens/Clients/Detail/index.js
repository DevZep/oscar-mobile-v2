import React, { Component }         from 'react'
import { View, Text, ScrollView }   from 'react-native'
import { connect }                  from 'react-redux'
import Swiper                       from 'react-native-swiper'
import { Navigation }               from 'react-native-navigation'
import DropdownAlert                from 'react-native-dropdownalert'
import { some }                     from 'lodash'
import appIcons                     from '../../../utils/Icon'
import { pushScreen }               from '../../../navigation/config'
import { acceptClient, rejectClient } from '../../../redux/actions/clients'
import Menu                         from './Menu'
import ClientInformation            from './Information'
import styles                       from './styles'

class ClientDetail extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'EDIT_CLIENT') {
      const { client, translations } = this.props
      const icons = await appIcons()
      const clientDetailTranslation = translations.clients.edit
      pushScreen(this.props.componentId, {
        screen: 'oscar.editClient',
        title: clientDetailTranslation.edit_client_title,
        props: {
          client,
          clientDetailComponentId: this.props.componentId,
          alertMessage: () => this.alertMessage('Client has been successfully updated.')
        },
        rightButtons: [
          {
            id: 'SAVE_CLIENT',
            icon: icons.save,
            color: '#fff'
          }
        ]
      })
    }
  }

  navigateToAssessments = (client, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.assessments',
      title,
      props: {
        clientId: client.id,
        setting: this.props.setting
      }
    })
  }

  navigateToCaseNotes = async (client, title) => {
    const icons = await appIcons()
    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNotes',
      title,
      props: { clientId: client.id },
      rightButtons: [
        {
          id: 'ADD_CASE_NOTE',
          icon: icons.add,
          color: '#fff'
        }
      ]
    })
  }

  navigateToTasks = (client, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.tasks',
      title,
      props: { clientId: client.id }
    })
  }

  navigateToEnrollProgramStreams = (client, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.enrolledProgramStreams',
      title,
      props: {
        clientId: client.id,
        clientDetailComponentId: this.props.componentId,
        alertMessage: () => this.alertMessage('Leave Program has been successfully created.')
      }
    })
  }

  navigateToActiveProgramStreams = (client, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.activeProgramStreams',
      title,
      props: {
        clientId: client.id,
        clientDetailComponentId: this.props.componentId,
        alertMessage: () => this.alertMessage('Enrollment has been successfully created.')
      }
    })
  }

  navigateToAdditionalForms = (client, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.additionalForms',
      title,
      props: {
        entityId: client.id,
        type: 'client'
      }
    })
  }

  navigateToAddForms = (client, title) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.addForms',
      title,
      props: {
        entityId: client.id,
        entityDetailComponentId: this.props.componentId,
        type: 'client',
        alertMessage: () => this.alertMessage('Custom Field Properties has been successfully created.')
      }
    })
  }

  onAcceptClient = client => {
    this.props.acceptClient(client)
  }

  onRejectClient = client => {
    Navigation.showModal({
      component: {
        name: 'oscar.exitNgo',
        passProps: {
          rejectClient: params => this.props.rejectClient(client, params),
        }
      }
    })
  }

  render() {
    const { client, setting, referralSourceCategories, translations, language } = this.props
    const enableAssessment = setting.enable_custom_assessment || setting.enable_default_assessment
    const clientDetailTranslation = translations.clients.show

    const enrolledProgramStreamCount = client.program_streams.filter(program_stream => some(program_stream.enrollments, { status: 'Active' }))
      .length

    const inactiveProgramStreams = client.inactive_program_streams.length
    const activeProgramStreams = client.program_streams.length
    const allProgramStreams = this.props.programStreams.length
    const availableProgramStreams = allProgramStreams - inactiveProgramStreams - activeProgramStreams
    const programStreams = `${inactiveProgramStreams} / ${availableProgramStreams}`

    const overdue = client.tasks.overdue.length
    const today = client.tasks.today.length
    const upcoming = client.tasks.upcoming.length
    const referred = client.status == 'Referred'
    return (
      <View style={{ flex: 1, backgroundColor: '#EDEFF1' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            referred &&
              <View style={styles.widgetContainer}>
                <View style={styles.widgetRow}>
                  <Menu
                    value={clientDetailTranslation.accepted}
                    color="#1c84c6"
                    onPress={() => this.onAcceptClient(client)}
                  />
                  <Menu
                    value={clientDetailTranslation.rejected}
                    color="#ED5565"
                    onPress={() => this.onRejectClient(client)}
                  />
                </View>
              </View>
          }
          {
            !referred &&
              <React.Fragment>
                <Swiper activeDotColor="#23c6c8" loop={false} height={250}>
                  <View style={styles.widgetContainer}>
                    <View style={styles.widgetRow}>
                      <Menu
                        title={clientDetailTranslation.view_assessments}
                        value={client.assessments.length}
                        color="#23c6c8"
                        onPress={() => this.navigateToAssessments(client, clientDetailTranslation.view_assessments)}
                        disabled={referred || !enableAssessment}
                      />
                      <Menu
                        title={clientDetailTranslation.view_case_notes}
                        value={client.case_notes.length}
                        color="#23c6c8"
                        onPress={() => this.navigateToCaseNotes(client, clientDetailTranslation.view_case_notes)}
                        disabled={referred}
                      />
                    </View>
                    <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                      <Menu
                        title={clientDetailTranslation.view_tasks}
                        value={`${overdue} / ${today} / ${upcoming}`}
                        color="#23c6c8"
                        onPress={() => this.navigateToTasks(client, clientDetailTranslation.view_tasks)}
                        disabled={referred}
                      />
                    </View>
                  </View>
                  <View style={styles.widgetContainer}>
                    <View style={styles.widgetRow}>
                      <Menu
                        title={clientDetailTranslation.enrolled_program_streams}
                        value={enrolledProgramStreamCount}
                        color="#1ab394"
                        onPress={() => this.navigateToEnrollProgramStreams(client, clientDetailTranslation.enrolled_program_streams)}
                        disabled={referred || enrolledProgramStreamCount == 0}
                      />
                      <Menu
                        title={clientDetailTranslation.program_streams}
                        value={programStreams}
                        color="#1ab394"
                        loading={this.props.programStreamsLoading}
                        onPress={() => this.navigateToActiveProgramStreams(client, clientDetailTranslation.program_streams)}
                        disabled={referred}
                      />
                    </View>
                    <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                      <Menu
                        title={clientDetailTranslation.additional_forms}
                        value={client.additional_form.length}
                        color="#1c84c6"
                        onPress={() => this.navigateToAdditionalForms(client, clientDetailTranslation.additional_forms)}
                        disabled={referred || client.additional_form.length == 0}
                      />
                      <Menu
                        title={clientDetailTranslation.add_form}
                        value={client.add_forms.length}
                        color="#1c84c6"
                        onPress={() => this.navigateToAddForms(client, clientDetailTranslation.add_form)}
                        disabled={referred}
                      />
                    </View>
                  </View>
                </Swiper>

                <View style={styles.absoluteContainer}>
                  <View style={styles.statusContainer}>
                    <Text style={styles.status}>{client.status}</Text>
                  </View>
                </View>
              </React.Fragment>
          }

          <ClientInformation client={client} setting={setting} referralSourceCategories={referralSourceCategories} translations={clientDetailTranslation} language={language}/>
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => {
  const language = state.language.language
  const translations = state.translations.data[language]
  return {
    programStreams: state.programStreams.data,
    programStreamsLoading: state.programStreams.loading,
    referralSourceCategories: state.referralSourceCategories.data,
    client: state.clients.data[ownProps.clientId],
    message: state.clients.message,
    language,
    translations
  }
}

const mapDispatch = {
  acceptClient,
  rejectClient
}

export default connect(mapState, mapDispatch)(ClientDetail)
