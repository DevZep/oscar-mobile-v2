import { combineReducers } from 'redux'
import auth from './auth'
import internet from './internet'
import language from './language'
import ngo from './ngo'
import provinces from './provinces'
import communes from './communes'
import villages from './villages'
import departments from './departments'
import users from './users'
import domains from './domains'
import clients from "./clients"
import families from './families'
import setting from './setting'
import programStreams from './programStreams'

export default combineReducers({
  auth,
  clients,
  users,
  internet,
  ngo,
  language,
  domains,
  provinces,
  communes,
  villages,
  departments,
  families,
  setting,
  programStreams
})
