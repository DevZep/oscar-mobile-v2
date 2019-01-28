import Immutable from "seamless-immutable";
import {PROVINCE_TYPES} from "../types";

const initialState = Immutable({
  error: "",
  data: [],
  loading: false
});

export default (provincesReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROVINCE_TYPES.PROVINCES_REQUESTING:
      return state.set("error", "").set("loading", true);

    case PROVINCE_TYPES.PROVINCES_SUCCEED:
      return state.set("data", action.data).set("loading", false);

    case PROVINCE_TYPES.PROVINCES_FAILED:
      return state.set("error", action.error).set("loading", false);

    default:
      return state;
  }
});
