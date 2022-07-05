import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  LOGOUT,
  // REFRESH_AUTH,
} from "../actions/types";

const access = localStorage.getItem("access");
const refresh = localStorage.getItem("refresh");

const initialState = {
  access: access === "null" ? null : access,
  refresh: refresh === "null" ? null : refresh,
  isAuthenticated: null,
  user: null,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
      };
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    // case REFRESH_AUTH:
    //   return {
    //     ...state,
    //     access: payload,
    //   };
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };
    case LOGOUT:
    case LOGIN_FAIL:
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
