import { combineReducers } from "redux";
import authReducer from "./auth";
import movieReducer from "./movie";

export default combineReducers({
  auth: authReducer,
  movie: movieReducer,
});
