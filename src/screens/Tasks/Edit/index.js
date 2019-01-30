import React, { Component } from 'react'
import Button               from 'apsl-react-native-button'
import Icon                 from 'react-native-vector-icons/MaterialIcons'
import styles               from './styles'

import {
  View,
  Text,
  Picker,
  TextInput,
  Alert
} from 'react-native'

export default class Task extends Component {
  state = {
    name: this.props.task.name,
    domain_id: this.props.task.domain.id,
    completion_date: this.props.task.completion_date,
  }

  editTask = () => {
    const { task } = this.props
    const { name, domain_id, completion_date } = this.state

    if (!name)
      Alert.alert(i18n.t('task.task_blank_title'), i18n.t('task.task_blank'))
    else if (!completion_date)
      Alert.alert(i18n.t('task.completion_blank_title'), i18n.t('task.completion_blank'))
    else
      this.props.onUpdateTask(this.state)
  }

  render() {
    return (
      <View />
      // <View style={styles.container}>
      //   <View style={styles.modalContainer}>
      //     <View style={styles.modalTitleWrapper}>
      //       <Text style={styles.modalTitle}>{languages.task.edit_title}</Text>
      //     </View>
      //     <View style={styles.modalContentWrapper}>
      //       {userClients != undefined
      //         ? <View style={styles.inputWrapper}>
      //             <Text style={styles.label}>{languages.task.client}</Text>
      //             <Picker
      //               mode="dropdown"
      //               selectedValue={this.state.userClient_id}
      //               onValueChange={userClient_id => this.setState({ userClient_id })}>
      //               {userClients.map((userClient, index) => {
      //                 const username =
      //                   _.isEmpty(userClient.given_name) && _.isEmpty(userClient.family_name)
      //                     ? 'N/A'
      //                     : `${userClient.given_name} ${userClient.family_name}`
      //                 return <Picker.Item key={index} label={username} value={userClient.id} />
      //               })}
      //             </Picker>
      //           </View>
      //         : null}

      //       <View style={styles.inputWrapper}>
      //         <Text style={styles.label}>{languages.task.domain}</Text>
      //         <Picker
      //           mode="dropdown"
      //           selectedValue={this.state.domain_id}
      //           onValueChange={domain_id => this.setState({ domain_id })}>
      //           {domains.map((domain, index) => {
      //             return (
      //               <Picker.Item
      //                 key={index}
      //                 label={`${domain.name} ${domain.identity}`}
      //                 value={domain.id}
      //               />
      //             )
      //           })}
      //         </Picker>
      //       </View>
      //       <View style={styles.inputWrapper}>
      //         <Text style={styles.label}>* {languages.task.task_detail}</Text>
      //         <TextInput
      //           autoCapitalize="sentences"
      //           ref="name"
      //           placeholder={languages.task.task_detail}
      //           underlineColorAndroid="#c7cdd3"
      //           value={this.state.name}
      //           onChangeText={name => this.setState({ name })}
      //         />
      //       </View>
      //       <View style={styles.inputWrapper}>
      //         <Text style={styles.label}>* {languages.task.complete_date}</Text>
      //         <DatePicker
      //           disabled={!this.props.internetReducer.get('isHasInternet')}
      //           style={styles.datePicker}
      //           date={this.state.completion_date}
      //           mode="date"
      //           placeholder={languages.client.select_date}
      //           placeholderText="#ccc"
      //           showIcon={true}
      //           format="YYYY-MM-DD"
      //           minDate="2000-01-01"
      //           confirmBtnText="Confirm"
      //           cancelBtnText="Cancel"
      //           onDateChange={completion_date =>
      //             this.setState({ completion_date: completion_date })}
      //           customStyles={{
      //             dateInput: styles.datePickerBorder
      //           }}
      //           iconComponent={
      //             <View style={styles.datePickerIcon}>
      //               <Icon name="date-range" size={30} />
      //             </View>
      //           }
      //         />
      //       </View>
      //     </View>
      //     <View style={styles.actionButtonWrapper}>
      //       <Button
      //         textStyle={styles.submitButtonText}
      //         style={styles.submitButton}
      //         onPress={() => this._editTask()}>
      //         {languages.button.save}
      //       </Button>
      //       <Button
      //         textStyle={styles.cancelButtonText}
      //         style={styles.cancelButton}
      //         onPress={() => this._dimissModal()}>
      //         {languages.button.cancel}
      //       </Button>
      //     </View>
      //   </View>
      // </View>
    )
  }
}
