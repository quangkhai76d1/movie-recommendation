import axiosClient from "./axiosClient";

const getuser = (access) => {
  const url = "/auth/users/me/";
  return axiosClient.get(url, {
    headers: {
      Authorization: `JWT ${access}`,
    },
  });
};

const login = (email, password) => {
  const url = "/auth/jwt/create";
  return axiosClient.post(url, {
    email,
    password,
  });
};

const signup = (email, name, password, re_password) => {
  const url = "/auth/users/";
  return axiosClient.post(url, {
    email,
    name,
    password,
    re_password,
  });
};

const checkAuth = (token) => {
  const url = "/auth/jwt/verify";
  return axiosClient.post(url, { token });
};

const resetPassword = (email) => {
  const url = "/auth/users/reset_password/";
  return axiosClient.post(url, { email });
};

const resetPasswordConfirm = (uid, token, new_password, re_new_password) => {
  const url = "/auth/users/reset_password_confirm/";
  return axiosClient.post(url, {
    uid,
    token,
    new_password,
    re_new_password,
  });
};

const activateUser = (uid, token) => {
  const url = "/auth/users/activation/";
  return axiosClient.post(url, {
    uid,
    token,
  });
};

// const refreshAuth = (refreshToken) => {
//   const url = "/auth/jwt/refresh";
//   return axiosClient.post(url, {
//     refresh: refreshToken,
//   });
// };

const authApi = {
  getuser,
  login,
  checkAuth,
  resetPassword,
  resetPasswordConfirm,
  signup,
  activateUser,
  // refreshAuth,
};

export default authApi;
