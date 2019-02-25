import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1
  },
  domainDetailContainer: {
    backgroundColor: '#fff',
    margin: 20,
    elevation: 15,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowColor: '#000'
  },
  domainNameContainer: {
    flexDirection: 'row',
    backgroundColor: '#009999',
    flexDirection: 'column',
    padding: 10,
    paddingLeft: 15,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  username: {
    fontWeight: 'bold',
    color: '#fff'
  },
  domainName: {
    fontSize: 11,
    color: '#fff'
  },
  domainDescriptionContainer: {
    backgroundColor: '#fff',
    height: 60,
    padding: 10,
    paddingLeft: 15,
    marginBottom: 10,
    borderRadius: 12
  },
  domainInfoContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  domainInfo: {
    padding: 10,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 10
  },
  button: {
    backgroundColor: '#bfbfbf',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff'
  },
  input: {
    height: 40,
    marginBottom: 3,
    backgroundColor: '#ccffff',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5
  },
  inputContainer: {
    backgroundColor: '#ccffff',
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15
  },
  subInputContainer: {
    backgroundColor: '#e6ffff',
    marginBottom: 10
  },
  labelContainer: {
    flexDirection: 'row',
    paddingBottom: 5,
    backgroundColor: '#e6ffff',
    padding: 5,
    marginBottom: 3
  },
  requireSign: {
    color: 'red'
  },
  taskTitle: {
    backgroundColor: '#fef49c',
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    elevation: 1
  },
  label: {
    fontWeight: 'bold'
  },
  tasksContainer: {
    paddingLeft: 10,
    flexDirection: 'row'
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderBottomColor: '#ccc',
    padding: 5
  },
  taskName: {
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 10
  },
  deleteIcon: {
    flex: 0.1,
    paddingRight: 10
  },
  attachmentWrapper: {
    height: 50,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    borderBottomColor: '#ccc',
    padding: 20,
    alignItems: 'center'
  },
  listAttachments: {
    marginLeft: 10,
    flex: 1
  },
  deleteAttactmentWrapper: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachmentWrapper: {
    height: 40,
    flexDirection: 'row',
    marginBottom: 4,
    padding: 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0)',
    borderBottomColor: '#e5e7e9'
  },
  attachmentSeparator: {
    backgroundColor: '#e8d2ff',
    marginBottom: 10,
    marginTop: 5
  },
  finishedAssessment: {
    alignItems: 'center',
    marginBottom: 10
  }
})

export default styles
