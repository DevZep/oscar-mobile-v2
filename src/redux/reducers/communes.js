import Immutable from "seamless-immutable";
import {COMMUNE_TYPES} from "../types";

const initialState = Immutable({
  error: "",
  data: [],
  loading: false
});

export default (communesReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMMUNE_TYPES.COMMUNES_REQUESTING:
      return state.set("error", "").set("loading", true);

    case COMMUNE_TYPES.COMMUNES_SUCCESS:
      return state.set("data", action.data).set("loading", false);

    case COMMUNE_TYPES.COMMUNES_FAILED:
      return state.set("error", action.error).set("loading", false);

    default:
      return state;
  }
});
