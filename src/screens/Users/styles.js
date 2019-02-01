import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1',
    padding: 20,
    paddingBottom: 0
  },
  contentsContainer: {
    backgroundColor: '#fff'
  },
  aboutFamily: {
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#009999',
    alignItems: 'flex-start',
    padding: 20
  },
  aboutFamilyText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  logoutButton: {
    backgroundColor: '#d73a49',
    borderWidth: 0,
    borderRadius: 0
  },
  buttonTitle: {
    fontSize: 18,
    color: '#fff'
  }
})

export default styles
