import axios from "axios"
import { PROGRAM_STREAM_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestProgramStreams = () => ({
  type: PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUESTING
})

requestProgramStreamsSucceed = data => ({
  type: PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUEST_SUCCESS,
  data
})

requestProgramStreamsFailed = error => ({
  type: PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUEST_FAILED,
  error
})

export function fetchProgramStreams() {
  return dispatch => {
    dispatch(requestProgramStreams())
    axios
      .get(endpoint.programStreamsPath)
      .then( (response) => {
        dispatch(requestProgramStreamsSucceed(response.data.program_streams))
      }).catch((err) => {
        dispatch(requestProgramStreamsFailed(err))
      })
  }
}
