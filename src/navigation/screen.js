import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import configureStore from '../redux/store'

import SplashScreen from '../screens/SplashScreen'
import Language from '../screens/Language'
import Ngos from '../screens/Ngos'
import Login from '../screens/Login'
import Pin from '../screens/Pin'
import WebView from '../screens/WebView'
import Clients from '../screens/Clients'
import Tasks from '../screens/Tasks'
import Users from '../screens/Users'
import Families from '../screens/Families'
import EditUser from '../screens/Users/Edit'

const store = configureStore()

export default () => {
  Navigation.registerComponentWithRedux('oscar.splashScreen', () => SplashScreen, Provider, store)
  Navigation.registerComponentWithRedux('oscar.language', () => Language, Provider, store)
  Navigation.registerComponentWithRedux('oscar.ngos', () => Ngos, Provider, store)
  Navigation.registerComponentWithRedux('oscar.login', () => Login, Provider, store)
  Navigation.registerComponentWithRedux('oscar.pin', () => Pin, Provider, store)
  Navigation.registerComponentWithRedux('oscar.webView', () => WebView, Provider, store)
  Navigation.registerComponentWithRedux('oscar.clients', () => Clients, Provider, store)
  Navigation.registerComponentWithRedux('oscar.tasks', () => Tasks, Provider, store)
  Navigation.registerComponentWithRedux('oscar.families', () => Families, Provider, store)
  Navigation.registerComponentWithRedux('oscar.users', () => Users, Provider, store)
  Navigation.registerComponentWithRedux('oscar.editUser', () => EditUser, Provider, store)
}
