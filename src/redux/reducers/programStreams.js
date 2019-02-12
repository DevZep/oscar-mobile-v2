import Immutable from 'seamless-immutable'
import { PROGRAM_STREAM_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: {},
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUESTING:
      return state.set('error', '').set('loading', true)

    case PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUEST_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
