import { StyleSheet } from 'react-native'

const customFormStyles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  container: {
    backgroundColor: '#fff'
  },
  pickerContainer: {
    borderColor: '#009999',
    borderWidth: 1,
    borderRadius: 2,
    padding: 6
  },
  picker: {
    height: 40,
    backgroundColor: '#fff'
  },
  input: {
    height: 40,
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#009999'
  },
  inputGreen: {
    height: 40,
    borderColor: '#1ab394',
    borderWidth: 1,
    marginBottom: 3
  },
  inputTextArea: {
    borderColor: '#009999',
    borderWidth: 1,
    marginBottom: 3,
    borderRadius: 2,
    height: 80
  },
  inputTextAreaGreen: {
    borderColor: '#1ab394',
    borderWidth: 1,
    marginBottom: 3
  },
  label: {
    color: '#009999',
    fontWeight: 'bold',
    paddingBottom: 3,
    marginBottom: 3
  },
  labelMargin: {
    marginTop: 10
  },
  labelGreen: {
    color: '#1ab394',
    fontWeight: 'bold',
    paddingBottom: 3,
    marginBottom: 3
  },
  aboutClientContainer: {
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 6,
    padding: 2,
    paddingTop: 6,
    paddingBottom: 6
  },
  fieldContainer: {
    paddingLeft: 5,
    paddingRight: 5
  },
  datePicker: {
    width: -1
  },
  datePickerBorder: {
    borderColor: '#009999',
    borderRadius: 2
  },
  emergencyCareHeaderContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1ab394'
  },
  emergencyCareHeader: {
    backgroundColor: '#1ab394',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 2,
    marginLeft: 2
  },
  emergencyHeaderText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff'
  },
  listAttachments: {
    marginLeft: 10,
    flex: 1
  },
  deleteAttactmentWrapper: {
    height: 40,
    width: 40,
    alignItems: 'center',
    backgroundColor: '#8106ff',
    justifyContent: 'center'
  },
  attachmentWrapper: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#eee',
    margin: 6,
    padding: 0,
    alignItems: 'center'
  },
  checkBox: {
    backgroundColor: 'transparent'
  }
})

const additionalFormDetailList = StyleSheet.create({
  titleWrapper: {
    flexDirection: 'row',
    margin: 20,
    marginBottom: 0,
    elevation: 15,
    height: '12%'
  },
  title: { flex: 1 },
  iconWrapper: { flexDirection: 'row' },
  deleteIcon: { marginLeft: 15 },
  mainContainer: {
    height: '95%',
    backgroundColor: '#EDEFF1'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 15,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    margin: 20,
    marginTop: 0
  },
  cardTitleWrapper: {
    padding: 20,
    backgroundColor: '#088'
  },
  cardTitle: {
    color: '#fff'
  },
  fieldContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    borderTopColor: '#EDEFF1'
  },
  field: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#009999'
  },
  fieldData: {
    fontSize: 18
  },
  multipleFiledContainer: {
    flexDirection: 'row',
    backgroundColor: '#dedede',
    borderRadius: 2,
    padding: 4,
    marginBottom: 2
  },
  thumnail: {
    width: 35,
    height: 35,
    marginRight: 12
  }
})

export { customFormStyles, additionalFormDetailList }
