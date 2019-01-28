import Immutable from "seamless-immutable";
import {DEPARTMENT_TYPES} from "../types";

const initialState = Immutable({
  error: "",
  data: [],
  loading: false
});

export default (departmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEPARTMENT_TYPES.DEPARTMENTS_REQUESTING:
      return state.set("error", "").set("loading", true);

    case DEPARTMENT_TYPES.DEPARTMENTS_SUCCESS:
      return state.set("data", action.data).set("loading", false);

    case DEPARTMENT_TYPES.DEPARTMENTS_FAILED:
      return state.set("error", action.error).set("loading", false);

    default:
      return state;
  }
});
