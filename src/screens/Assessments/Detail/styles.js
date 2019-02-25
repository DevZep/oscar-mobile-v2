import { StyleSheet } from 'react-native'
import { MAIN_COLOR } from '../../../constants/colors'

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#EDEFF1',
    flex: 1
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20
  },
  clientNameContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: MAIN_COLOR,
    elevation: 15,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  clientNameLabel: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 5
  },
  clientNameValue: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18
  },
  assessmentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  fieldDataContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  label: {
    fontWeight: 'bold',
    color: '#fff'
  },
  fieldData: {
    marginBottom: 10,
    color: '#fff'
  },
  taskItem: {
    marginTop: 5,
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'row',
  },
  taskItemText: {
    paddingLeft: 15,
    color: '#fff'
  },
  listAttachments: {
    marginLeft: 10,
    marginTop: 10,
    flex: 1,
    color: '#fff'
  },
  attachmentSeparator: {
    height: 1,
    backgroundColor: '#fff',
    marginBottom: 5,
    marginTop: 5,
  },
  domainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  scoreContainer: {
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  dualScore: {
    padding: 5,
    color: '#fff',
    borderRadius: 5,
    marginLeft: 5,
  },
  singleScore: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    color: '#fff'
  }
})

export default styles