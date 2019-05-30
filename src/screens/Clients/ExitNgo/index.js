import React, { Component } from 'react'
import { Navigation }       from 'react-native-navigation'
import Button               from 'apsl-react-native-button'
import Icon                 from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import DatePicker           from 'react-native-datepicker'

import {
  View,
  Text,
  ScrollView,
  TextInput
} from 'react-native'

import { MAIN_COLOR }       from '../../../constants/colors'
import i18n                 from '../../../i18n'
import styles               from './styles'

const EXIT_REASONS = [
  'Client is/moved outside NGO target area (within Cambodia)',
  'Client is/moved outside NGO target area (International)',
  'Client refused service',
  'Client does not meet / no longer meets service criteria',
  'Client died',
  'Client does not require / no longer requires support',
  'Agency lacks sufficient resources',
  'Other'
]

class ExitNgoForm extends Component {
  state = {
    exit_date: "",
    exit_reasons: [],
    other_info_of_exit: "",
    exit_circumstance: "Rejected Referral",
    exit_note: ""
  }

  onSubmit = () => {
    const { exit_date, exit_reasons, other_info_of_exit, exit_circumstance, exit_note } = this.state
    const isValid = Boolean(exit_date) &&
                    Boolean(other_info_of_exit) &&
                    Boolean(exit_note) &&
                    exit_reasons.length > 0

    if (!isValid)
      alert("Please complete all the fields!")
    else
      this.props.rejectClient(this.state)
  }

  onCancel = () => {
    Navigation.dismissAllModals()
  }

  render() {
    const { exit_date, exit_reasons, other_info_of_exit, exit_circumstance, exit_note } = this.state

    return (
      <ScrollView style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.modalTitle}>{i18n.t('client.exit_ngos.exit_ngo')}</Text>
          </View>
          <View style={styles.modalContentWrapper}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('client.exit_ngos.exit_date')}</Text>
              <DatePicker
                style={styles.datePicker}
                date={exit_date}
                mode="date"
                placeholder={i18n.t('client.select_date')}
                placeholderText="#ccc"
                showIcon={true}
                format="YYYY-MM-DD"
                minDate="2000-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={exit_date => this.setState({ exit_date })}
                customStyles={{ dateInput: styles.datePickerBorder }}
                iconComponent={
                  <View style={styles.datePickerIcon}>
                    <Icon name="date-range" size={30} />
                  </View>
                }
              />
            </View>


            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('client.exit_ngos.exit_reasons')}</Text>
              <SectionedMultiSelect
                items={ EXIT_REASONS.map(reason => ({ id: reason, name: reason })) }
                uniqueKey="id"
                modalWithSafeAreaView
                selectText={i18n.t('select_option')}
                alwaysShowSelectText={true}
                searchPlaceholderText={i18n.t('search')}
                confirmText={i18n.t('confirm')}
                showDropDowns={true}
                hideSearch={false}
                showCancelButton={true}
                styles={{
                  button: { backgroundColor: MAIN_COLOR },
                  cancelButton: { width: 150 },
                  chipText: { maxWidth: 220 },
                  selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
                }}
                onSelectedItemsChange={exit_reasons => this.setState({ exit_reasons }) }
                selectedItems={exit_reasons}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('client.exit_ngos.other_info_of_exit')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('task.task_detail')}
                underlineColorAndroid="#c7cdd3"
                value={other_info_of_exit}
                onChangeText={other_info_of_exit => this.setState({ other_info_of_exit })}
                style={{ height: 40 }}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('client.exit_ngos.exit_circumstance')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('task.task_detail')}
                underlineColorAndroid="#c7cdd3"
                value={exit_circumstance}
                onChangeText={exit_circumstance => this.setState({ exit_circumstance })}
                style={{ height: 40 }}
                editable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* {i18n.t('client.exit_ngos.exit_note')}</Text>
              <TextInput
                autoCapitalize="sentences"
                placeholder={i18n.t('task.task_detail')}
                underlineColorAndroid="#c7cdd3"
                value={exit_note}
                onChangeText={exit_note => this.setState({ exit_note })}
                multiline={true}
                textAlignVertical="top"
                numberOfLines={3}
                style={{ height: 100 }}
              />
            </View>
          </View>
          <View style={styles.actionButtonWrapper}>
            <Button
              textStyle={styles.submitButtonText}
              style={styles.submitButton}
              onPress={this.onSubmit}>
              {i18n.t('button.save')}
            </Button>
            <Button
              textStyle={styles.cancelButtonText}
              style={styles.cancelButton}
              onPress={this.onCancel}>
              {i18n.t('button.cancel')}
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default ExitNgoForm