import authApi from "../api/authApi";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  LOGOUT,
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_SUCCESS,
} from "../actions/types";

export const load_user = () => async (dispatch, getState) => {
  try {
    const { isAuthenticated, access } = getState().auth;

    if (!isAuthenticated && !access) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
      throw new Error();
    }

    const data = await authApi.getuser(access);

    dispatch({
      type: USER_LOADED_SUCCESS,
      payload: data,
    });
  } catch (err) {
    // console.log(err);
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

// export const auth_load_user = () => async (dispatch, getState) => {
//   try {
//     const {auth}
//   } catch (err) {
//
//   }
// }

export const login = (email, password) => async (dispatch) => {
  try {
    const data = await authApi.login(email, password);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });

    dispatch(load_user());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const checkAuthenticated = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.access;

    if (!token) {
      throw new Error();
    }

    const data = await authApi.checkAuth(token);

    if (data.code !== "token_not_valid") {
      dispatch({
        type: AUTHENTICATED_SUCCESS,
      });
    } else {
      throw new Error("Token Not Valid");
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

// export const refreshAccessToken = () => async (state, dispatch) => {
//   try {
//     const refreshToken = state.getState().auth.refresh;

//     if (!refreshToken) {
//       throw new Error("Refresh token not exists");
//     }

//     const data = await authApi.refreshAuth(refreshToken);

//     if (data.code !== "token_not_valid") {
//       dispatch({
//         type: REFRESH_AUTH,
//         payload: data,
//       });
//     } else {
//       throw new Error("Token Not Valid");
//     }
//   } catch (err) {
//     console.log(err);
//     dispatch({
//       type: AUTHENTICATED_FAIL,
//     });
//   }
// };

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
