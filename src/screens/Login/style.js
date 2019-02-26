import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    paddingTop: 0
  },
  imageWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center'
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  input: {
    marginBottom: 20,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#009999'
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#009999',
    borderWidth: 0,
    elevation: 3
  },
  showPassword: {
    position: 'absolute',
    right: 6,
    top: 6
  }
})

export default styles
