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
import TaskDetail from '../screens/Tasks/Detail'
import TaskForm from '../screens/Tasks/Form'
import FamilyDetail from '../screens/Families/Detail'
import EditFamily from '../screens/Families/Edit'
import AdditionalFormDetail from '../screens/AdditionalFormDetail'
import ClientDetail from '../screens/Clients/Detail'
import Assessments from '../screens/Assessments'
import AssessmentDetail from '../screens/Assessments/Detail'
import AssessmentForm from '../screens/Assessments/Form'
import DomainDescriptionModal from '../screens/Assessments/Form/domainDescriptionModal'
import CreateCustomForm from '../screens/CreateCustomForm'
import EditCustomForm from '../screens/EditCustomForm'
import ListAddForms from '../screens/ListAddForms'
import ListAdditionalForms from '../screens/ListAdditionalForms'
import ActiveProgramStreams from '../screens/Clients/programStreams/ActiveProgramStreams'
import EnrolledProgramStreams from '../screens/Clients/programStreams/EnrolledProgramStreams'
import ProgramStreamDetail from '../screens/Clients/programStreams/ProgramStreamDetail'
import EnrollmentDetail from '../screens/Clients/programStreams/EnrollmentDetail'
import EnrollmentForm from '../screens/Clients/programStreams/EnrollmentForm'
import EditForm from '../screens/Clients/programStreams/EditForm'
import ListTracking from '../screens/Clients/programStreams/ListTracking'
import ExitForm from '../screens/Clients/programStreams/ExitForm'
import TrackingForm from '../screens/Clients/programStreams/TrackingForm'
import TrackingDetail from '../screens/Clients/programStreams/TrackingDetail'

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
  Navigation.registerComponentWithRedux('oscar.taskDetail', () => TaskDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.taskForm', () => TaskForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.familyDetail', () => FamilyDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.editFamily', () => EditFamily, Provider, store)
  Navigation.registerComponentWithRedux('oscar.addForms', () => ListAddForms, Provider, store)
  Navigation.registerComponentWithRedux('oscar.additionalForms', () => ListAdditionalForms, Provider, store)
  Navigation.registerComponentWithRedux('oscar.clientDetail', () => ClientDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.assessments', () => Assessments, Provider, store)
  Navigation.registerComponentWithRedux('oscar.assessmentDetail', () => AssessmentDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.assessmentForm', () => AssessmentForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.domainDescriptionModal', () => DomainDescriptionModal, Provider, store)
  Navigation.registerComponentWithRedux('oscar.createCustomForm', () => CreateCustomForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.editCustomForm', () => EditCustomForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.additionalFormDetail', () => AdditionalFormDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.programStreamDetail', () => ProgramStreamDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.enrollmentDetail', () => EnrollmentDetail, Provider, store)
  Navigation.registerComponentWithRedux('oscar.enrollmentForm', () => EnrollmentForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.editForm', () => EditForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.activeProgramStreams', () => ActiveProgramStreams, Provider, store)
  Navigation.registerComponentWithRedux('oscar.enrolledProgramStreams', () => EnrolledProgramStreams, Provider, store)
  Navigation.registerComponentWithRedux('oscar.listTracking', () => ListTracking, Provider, store)
  Navigation.registerComponentWithRedux('oscar.exitForm', () => ExitForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.trackingForm', () => TrackingForm, Provider, store)
  Navigation.registerComponentWithRedux('oscar.trackingDetail', () => TrackingDetail, Provider, store)
}
