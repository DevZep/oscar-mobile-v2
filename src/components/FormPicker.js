import React, { Component } from 'react'
import styled from 'styled-components'
import { Modal, TouchableWithoutFeedback, Platform, View, Picker, TouchableOpacity } from 'react-native'
import _ from 'lodash'

export default class FormPicker extends Component {
  state = { modalVisible: false, selectedValue: this.props.value }

  onPress = () => {
    this.setState({ modalVisible: false }, () => {
      this.props.onChange(this.state.selectedValue)
    })
  }

  resetState = () => {
    this.setState({ modalVisible: false, selectedValue: this.props.value })
  }

  renderPicker(options) {
    return _.map(options, (option, index) => <Picker.Item key={index} label={option.name} value={option.id} />)
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <Wrapper>
          <AndroidPickerWrapper>
            <Picker selectedValue={props.value} onValueChange={props.onChange}>
              <Picker.Item value="" label="Please select..." />
              {this.renderPicker(this.props.options)}
            </Picker>
          </AndroidPickerWrapper>
        </Wrapper>
      )
    } else {
      const selectedItem = _.find(this.props.options, { id: this.props.value })
      const selectedLabel = selectedItem ? selectedItem.name : ''
      return (
        <Wrapper>
          <InputContainer>
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible: true })
              }}
            >
              {this.props.value === null ? (
                <Input style={{ color: '#ddd' }}>Please select...</Input>
              ) : (
                <Input>{selectedLabel}</Input>
              )}
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
              <TouchableWithoutFeedback onPress={this.resetState} style={{ backgroundColor: '#ddd' }}>
                <ModalContainer>
                  <ModalContent>
                    <DoneButton onPress={this.onPress}>Done</DoneButton>
                  </ModalContent>
                  <View
                    style={{ backgroundColor: '#fff' }}
                    onStartShouldSetResponder={evt => true}
                    onResponderReject={evt => {}}
                  >
                    <Picker
                      selectedValue={this.state.selectedValue}
                      onValueChange={(itemValue, itemIndex) => this.setState({ selectedValue: itemValue })}
                    >
                      <Picker.Item value="" label="Please select..." />
                      {this.renderPicker(this.props.options)}
                    </Picker>
                  </View>
                </ModalContainer>
              </TouchableWithoutFeedback>
            </Modal>
          </InputContainer>
        </Wrapper>
      )
    }
  }
}

const InputContainer = styled.View`
  border-color: #009999;
  border-width: 1;
`

const Input = styled.Text`
  padding-left: 5;
  padding-right: 5;
  padding-top: 10;
  padding-bottom: 10;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`
const ModalContent = styled.View`
  justify-content: flex-end;
  flex-direction: row;
  padding: 10px;
  background-color: #009999;
`

const DoneButton = styled.Text`
  color: #fff;
  font-weight: bold;
`

const Hint = styled.Text`
  font-style: italic;
  margin-bottom: 10;
`

const AndroidPickerWrapper = styled.View`
  border-width: 1px;
  border-color: #009999;
`

const Wrapper = styled.View`
  margin-bottom: 10px;
`
