import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  widgetContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFF'
  },
  widgetRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  absoluteContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 230,
    zIndex: 20,
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    width: 100,
    backgroundColor: '#1ab394',
    borderRadius: 5,
    elevation: 5,
    shadowOffset:{  width: 5,  height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    padding: 10,
  },
  status: {
    color: '#fff',
  },
})

export default styles