import { combineReducers } from 'redux'
import auth from './auth'
import internet from './internet'
import language from './language'
import ngo from './ngo'
import provinces from './provinces'
import districts from './districts'
import communes from './communes'
import villages from './villages'
import departments from './departments'
import users from './users'
import domains from './domains'
import clients from './clients'
import families from './families'
import setting from './setting'
import programStreams from './programStreams'
import birthProvinces from './birthProvinces'
import quantitativeTypes from './quantitativeTypes'
import referralSources from './referralSources'
import referralSourceCategories from './referralSourceCategories'
import agencies from './agencies'
import donors from './donors'
import translations from './translations'

export default combineReducers({
  auth,
  clients,
  users,
  internet,
  ngo,
  language,
  domains,
  provinces,
  districts,
  communes,
  villages,
  departments,
  families,
  setting,
  programStreams,
  birthProvinces,
  quantitativeTypes,
  referralSources,
  agencies,
  donors,
  translations,
  referralSourceCategories
})
