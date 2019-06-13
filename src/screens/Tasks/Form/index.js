import React, { Component } from 'react'
import Button               from 'apsl-react-native-button'
import Icon                 from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import DatePicker           from 'react-native-datepicker'
import { Navigation }       from 'react-native-navigation'
import { MAIN_COLOR }       from '../../../constants/colors'
import styles               from './styles'
import i18n                 from '../../../i18n'
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView
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
    const { domains, formTranslations } = this.props

    return (
      <ScrollView style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.modalTitle}>{i18n.t('task.edit_title')}</Text>
          </View>
          <View style={styles.modalContentWrapper}>
            {
              !this.props.domain &&
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>{formTranslations.domain}</Text>
                  <SectionedMultiSelect
                    items={ domains.map(domain => ({ id: domain.id, name: `${domain.name} ${domain.identity}` })) }
                    uniqueKey='id'
                    selectText='Please choose domain'
                    single={true}
                    showDropDowns={true}
                    single={true}
                    hideSearch={true}
                    showCancelButton={true}
                    modalWithSafeAreaView
                    styles={{
                      button: { backgroundColor: MAIN_COLOR },
                      cancelButton: { width: 150 },
                      chipText: { maxWidth: 280 },
                      selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
                    }}
                    onSelectedItemsChange={ domainIds => this.setState({ domain_id: domainIds[0] }) }
                    selectedItems={[this.state.domain_id]}
                  />
                </View>
            }
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {formTranslations.enter_task_detail}</Text>
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
              <Text style={styles.label}>* {formTranslations.completion_date}</Text>
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
              {formTranslations.save}
            </Button>
            <Button
              textStyle={styles.cancelButtonText}
              style={styles.cancelButton}
              onPress={ () => Navigation.dismissAllModals() }>
              {formTranslations.back}
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
}
