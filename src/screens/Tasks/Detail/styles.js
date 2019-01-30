import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1',
    padding: 20
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  taskContainer: {
    paddingTop: 10,
    paddingBottom: 10
  },
  completionDate: {
    fontSize: 11,
    marginTop: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#c7cdd3',
    padding: 10
  },
  taskName: {
    borderWidth: 1,
    borderColor: '#c7cdd3',
    borderTopWidth: 0,
    padding: 10
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    height: 25,
    width: 25,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEdit: {
    borderColor: '#1c84c6',
    marginRight: 2
  },
  iconDelete: {
    borderColor: '#ED5565',
    marginLeft: 2
  }
})