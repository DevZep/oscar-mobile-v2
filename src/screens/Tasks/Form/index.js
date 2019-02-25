import React, { Component } from 'react'
import Button               from 'apsl-react-native-button'
import Icon                 from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import DatePicker           from 'react-native-datepicker'
import { Navigation }       from 'react-native-navigation'
import styles               from './styles'
import i18n                 from '../../../i18n'
import { MAIN_COLOR }       from '../../../constants/colors'

import {
  View,
  Text,
  Picker,
  TextInput,
  Alert
} from 'react-native'

export default class Task extends Component {
  state = {
    name: '',
    domain_id: null,
    completion_date: null
  }

  componentDidMount() {
    const { task, domain } = this.props

    if (task)
      this.setState({
        name: task.name,
        domain_id: task.domain.id,
        completion_date: task.completion_date,
      })

    if (domain)
      this.setState({
        domain_id: domain.id
      })
  }

  updateTask = () => {
    const { task } = this.props
    const { name, domain_id, completion_date } = this.state

    if (!name)
      Alert.alert(i18n.t('task.task_blank_title'), i18n.t('task.task_blank'))
    else if (!completion_date)
      Alert.alert(i18n.t('task.completion_blank_title'), i18n.t('task.completion_blank'))
    else
      if (this.props.task)
        this.props.onUpdateTask(this.state)
      else
        this.props.onCreateTask(this.state)
  }

  render() {
    const { domains } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.modalTitle}>{i18n.t('task.edit_title')}</Text>
          </View>
          <View style={styles.modalContentWrapper}>
            {
              !this.props.domain &&
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>{i18n.t('task.domain')}</Text>
                  <SectionedMultiSelect
                    items={ domains.map(domain => ({ id: domain.id, name: `${domain.name} ${domain.identity}` })) }
                    uniqueKey='id'
                    selectText='Please choose domain'
                    single={true}
                    hideSearch={true}
                    styles={{
                      container: { backgroundColor: 'transparent' },
                      item: { padding: 10},
                    }}
                    onSelectedItemsChange={ domainIds => this.setState({ domain_id: domainIds[0] }) }
                    selectedItems={[this.state.domain_id]}
                    modalWithSafeAreaView
                    hideConfirm
                  />
                </View>
            }
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('task.task_detail')}</Text>
              <TextInput
                autoCapitalize="sentences"
                ref="name"
                placeholder={i18n.t('task.task_detail')}
                underlineColorAndroid="#c7cdd3"
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                style={{ height: 40 }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('task.complete_date')}</Text>
              <DatePicker
                style={styles.datePicker}
                date={this.state.completion_date}
                mode="date"
                placeholder={i18n.t('client.select_date')}
                placeholderText="#ccc"
                showIcon={true}
                format="YYYY-MM-DD"
                minDate="2000-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={completion_date =>
                  this.setState({ completion_date: completion_date })}
                customStyles={{
                  dateInput: styles.datePickerBorder
                }}
                iconComponent={
                  <View style={styles.datePickerIcon}>
                    <Icon name="date-range" size={30} />
                  </View>
                }
              />
            </View>
          </View>
          <View style={styles.actionButtonWrapper}>
            <Button
              textStyle={styles.submitButtonText}
              style={styles.submitButton}
              onPress={() => this.updateTask()}>
              {i18n.t('button.save')}
            </Button>
            <Button
              textStyle={styles.cancelButtonText}
              style={styles.cancelButton}
              onPress={ () => Navigation.dismissAllModals() }>
              {i18n.t('button.cancel')}
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
