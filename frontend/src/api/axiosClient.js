import axios from "axios";
import queryString from "query-string";

const baseURL = process.env.REACT_APP_API_URL;

let store;

export const injectStore = (_store) => {
  store = _store;
};

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (req) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  if (isAuthenticated) {
    req.headers.Authorization = `JWT ${store.getState().auth.access}`;
  }
  return req;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
