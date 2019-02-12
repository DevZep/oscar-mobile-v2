import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect }  from 'react-redux'
import Swiper from 'react-native-swiper'
import _ from 'lodash'
import { pushScreen } from '../../../navigation/config'
import i18n from '../../../i18n'
import ClientInformation from './Information'
import Menu from './Menu'
import styles from './styles'


class ClientDetail extends Component {
  navigateToAssessments = (client) => {}
  navigateToCaseNotes = (client) => {}
  navigateToTasks = (client) => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.tasks',
      title: i18n.t('task.title'),
      props: { clientId: client.id }
    })
  }
  navigateToEnrollProgramStreams = (client) => {}
  navigateToProgramStreams = (client) => {}
  navigateToAdditionalForms = (client) => {}
  navigateToAddForms = (client) => {}

  render() {
    const { clients, setting } = this.props
    const client = clients[this.props.clientId]
    const enableAssessment = setting.enable_custom_assessment || setting.enable_default_assessment

    const enrolledProgramStreamCount = client.program_streams.filter(
      program_stream => _.some(program_stream.enrollments, { status: 'Active' })).length

    const inactiveProgramStreams  = client.inactive_program_streams.length
    const activeProgramStreams    = client.program_streams.length
    const allProgramStreams       = this.props.programStreams.length
    const availableProgramStreams = allProgramStreams - inactiveProgramStreams - activeProgramStreams
    const programStreams          = `${inactiveProgramStreams} / ${availableProgramStreams}`

    const overdue   = client.tasks.overdue.length
    const today     = client.tasks.today.length
    const upcoming  = client.tasks.upcoming.length
    console.log(client.tasks)
    return (
      <View style={{ flex: 1, backgroundColor: '#EDEFF1' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Swiper activeDotColor="#23c6c8" loop={false} height={250} >
            <View style={styles.widgetContainer}>
              <View style={styles.widgetRow}>
                <Menu
                  title={i18n.t('client.assessments')}
                  value={client.assessments.length}
                  color='#23c6c8'
                  onPress={() => this.navigateToAssessments(client)}
                  disabled={ !enableAssessment }
                />
                <Menu
                  title={i18n.t('client.case_notes')}
                  value={client.case_notes.length}
                  color='#23c6c8'
                  onPress={() => this.navigateToCaseNotes(client)}
                />
              </View>
              <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                <Menu
                  title={i18n.t('client.tasks')}
                  value={`${overdue} / ${today} / ${upcoming}`}
                  color='#23c6c8'
                  onPress={() => this.navigateToTasks(client)}
                />
              </View>
            </View>
            <View style={styles.widgetContainer}>
              <View style={styles.widgetRow}>
                <Menu
                  title={i18n.t('client.enrolled_program_streams')}
                  value={enrolledProgramStreamCount}
                  color='#1ab394'
                  onPress={() => this.navigateToEnrollProgramStreams(client)}
                  disabled={ enrolledProgramStreamCount == 0 }
                />
                <Menu
                  title={i18n.t('client.program_stream')}
                  value={programStreams}
                  color='#1ab394'
                  loading={this.props.programStreamsLoading}
                  onPress={() =>  this.navigateToProgramStreams(client) }
                />
              </View>
              <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                <Menu
                  title={i18n.t('client.additional_form')}
                  value={client.additional_form.length}
                  color='#1c84c6'
                  onPress={() => this.navigateToAdditionalForms(client)}
                  disabled={ client.additional_form.length == 0 }
                />
                <Menu
                  title={i18n.t('client.add_form')}
                  value={client.add_forms.length}
                  color='#1c84c6'
                  onPress={() => this.navigateToAddForms(client)}
                />
              </View>
            </View>
          </Swiper>

          <View style={styles.absoluteContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.status}>
                {client.status}
              </Text>
            </View>
          </View>

          <ClientInformation client={client} />
        </ScrollView>
      </View>
    )
  }
}

const mapState = (state) => ({
  programStreams: state.programStreams.data,
  programStreamsLoading: state.programStreams.loading,
  clients: state.clients.data
})

export default connect(mapState)(ClientDetail)