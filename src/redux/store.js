import { applyMiddleware, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from './reducers'
import { autoRehydrate, persistStore } from 'redux-persist'
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable'
import { AsyncStorage } from 'react-native'

const store = createStore(
  rootReducer,
  {},
  compose(
    autoRehydrate(),
    applyMiddleware(thunkMiddleware)
  )
)
persistStore(store, {
  storage: AsyncStorage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator({})]
})

export default function configureStore() {
  return store
}
