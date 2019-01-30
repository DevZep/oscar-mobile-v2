import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'rgba(128, 128, 128, 0.83)'
  },
  modalContainer: {
    margin: 30,
    elevation: 15,
    backgroundColor: '#fff'
  },
  modalTitleWrapper: {
    backgroundColor: '#009999',
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff'
  },
  modalContentWrapper: {
    padding: 20,
    backgroundColor: '#fff'
  },
  inputWrapper: {},
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10
  },
  actionButtonWrapper: {
    flexDirection: 'row',
    height: 70
  },
  cancelButton: {
    flex: 1,
    borderRadius: 1,
    borderWidth: 0,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    height: 46,
    borderColor: '#009999',
    elevation: 5
  },
  submitButton: {
    flex: 1,
    borderRadius: 1,
    borderWidth: 0,
    marginLeft: 20,
    backgroundColor: '#009999',
    height: 46,
    elevation: 5
  },
  cancelButtonText: {
    color: '#009999'
  },
  submitButtonText: {
    color: '#fff'
  },
  datePicker: {
    width: -1,
    borderColor: '#00BCD4'
  },
  datePickerBorder: {
    borderColor: '#c7cdd3'
  },
  datePickerIcon: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#c7cdd3',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles