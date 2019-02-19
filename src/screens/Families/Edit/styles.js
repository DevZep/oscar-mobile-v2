import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 6,
    elevation: 6
  },
  datePicker: {
    width: -1,
    borderColor: '#009999',
    backgroundColor: '#fff'
  },
  datePickerBorder: {
    borderColor: '#009999',
    borderRadius: 2
  },
  datePickerIcon: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#009999',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  picker: {
    height: 45,
    backgroundColor: '#eee'
  },
  inputContainer: {
    paddingLeft: 10,
    paddingRight: 10
  },
  label: {
    color: '#009999',
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#009999'
  },
  sms: {
    color: '#dedede'
  },
  row: {
    flexDirection: 'row'
  },
  checkbox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5
  },
  inputTextArea: {
    borderColor: '#009999',
    borderWidth: 1,
    marginBottom: 3,
    borderRadius: 2
  }
})

export default styles
