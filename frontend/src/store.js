import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const inititalState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  inititalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(() => {
  localStorage.setItem("access", store.getState().auth.access);
  localStorage.setItem("refresh", store.getState().auth.refresh);
});

export default store;
