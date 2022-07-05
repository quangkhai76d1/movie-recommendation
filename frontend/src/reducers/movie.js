import {
  LOAD_MOVIES,
  ADD_MOVIES,
  LOAD_MOVIES_FAIL,
  CHECK_USER_RATED_MOVIE_FAIL,
  CHECK_USER_RATED_MOVIE,
  RATING_MOVIE,
  RATING_MOVIE_FAIL,
  LOAD_RECOMMENDATIONS,
  LOAD_OWNER_RATINGS,
  LOAD_OWNER_RATINGS_FAIL,
} from "../actions/types";

const initialState = {
  count: null,
  next: null,
  previous: null,
  results: [],
};

const movieReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_MOVIES:
      return payload;
    case LOAD_OWNER_RATINGS:
    case CHECK_USER_RATED_MOVIE:
    case RATING_MOVIE:
    case LOAD_RECOMMENDATIONS:
    case ADD_MOVIES:
      return { ...state, results: payload };
    case RATING_MOVIE_FAIL:
    case LOAD_MOVIES_FAIL:
    case LOAD_OWNER_RATINGS_FAIL:
    case CHECK_USER_RATED_MOVIE_FAIL:
    default:
      return state;
  }
};

export default movieReducer;
