import Immutable        from 'seamless-immutable'
import { FAMILY_TYPES } from "../types"

const initialState = Immutable({
  data: {},
  error: "",
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case FAMILY_TYPES.FAMILIES_REQUESTING:
      return state.set("error", "")
                  .set("loading", true)

    case FAMILY_TYPES.FAMILIES_REQUEST_SUCCESS:
      return state.set("data", action.data)
                  .set("loading", false)

    case FAMILY_TYPES.FAMILIES_REQUEST_FAILED:
      return state.set("error", action.error)
                  .set("loading", false)

    default:
      return state
  }
}
