import movieApi from "../api/movieApi";
import axiosClient from "../api/axiosClient";
import {
  ADD_MOVIES,
  CHECK_USER_RATED_MOVIE,
  LOAD_MOVIES,
  LOAD_MOVIES_FAIL,
  CHECK_USER_RATED_MOVIE_FAIL,
  RATING_MOVIE,
  RATING_MOVIE_FAIL,
  LOAD_RECOMMENDATIONS,
  LOAD_RECOMMENDATIONS_FAIL,
  LOAD_OWNER_RATINGS_FAIL,
  LOAD_OWNER_RATINGS,
} from "../actions/types";
import _ from "lodash";

export const load_movies = (params) => async (dispatch) => {
  try {
    const data = await movieApi.getMovies(params);

    await Promise.all(
      data.results.map(async (movie) => {
        const { poster_path } = await movieApi.getTmdbMovieById(movie.id);
        movie.show = true;
        movie.poster_path = poster_path;
      })
    );
    // payload = data.results.map((movie) => (movie.show = true));
    // console.log(data);

    dispatch({
      type: LOAD_MOVIES,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({ type: LOAD_MOVIES_FAIL });
  }
};

export const change_movies_page = (pageCount) => async (dispatch, getState) => {
  const { next, previous } = getState().movie;

  const url = next ? new URL(next) : new URL(previous);
  const search_params = url.searchParams;
  search_params.set("page", pageCount);

  url.search = search_params.toString();

  const new_url = url.toString();

  try {
    const data = await axiosClient.get(new_url);
    await Promise.all(
      data.results.map(async (movie) => {
        const { poster_path } = await movieApi.getTmdbMovieById(movie.id);
        movie.show = true;
        movie.poster_path = poster_path;
      })
    );

    dispatch({
      type: LOAD_MOVIES,
      payload: data,
    });
  } catch (err) {
    dispatch({ type: LOAD_MOVIES_FAIL });
  }
};

export const load_similar_and_check_rated =
  (movieId) => async (dispatch, getState) => {
    try {
      const movies = getState().movie.results;
      const isAuthenticated = getState().auth.isAuthenticated;

      let data = await movieApi.getSimilarMovies(movieId);

      const ids = data.map(({ id }) => id);

      data = _.unionBy(movies, data, "id");

      data = await Promise.all(
        data.map(async (movie) => {
          if (ids.includes(movie.id)) {
            movie.similarId = movie.similarId
              ? [...movie.similarId, movieId]
              : [movieId];

            const { poster_path } = await movieApi.getTmdbMovieById(movie.id);

            movie.poster_path = poster_path;
          }

          return movie;
        })
      );
      console.log(data);

      dispatch({ type: ADD_MOVIES, payload: data });

      if (isAuthenticated) {
        dispatch(check_rated_by_user(movieId));
      }
      dispatch({ type: LOAD_MOVIES_FAIL });
    } catch (err) {}
  };

export const check_rated_by_user = (movieId) => async (dispatch, getState) => {
  try {
    let movies = getState().movie.results;
    const data = await movieApi.checkMovieRatedByUser(movieId);

    const payload = movies.map((movie) => {
      if (movie.id === movieId) {
        movie.my_rating = data;
      }

      return movie;
    });

    dispatch({
      type: CHECK_USER_RATED_MOVIE,
      payload,
    });
  } catch (err) {
    dispatch({
      type: CHECK_USER_RATED_MOVIE_FAIL,
    });
  }
};

export const load_recommendations = () => async (dispatch, getState) => {
  try {
    const movies = getState().movie.results;
    const data = await movieApi.getMovieRecommendations();

    const ids = data.map(({ id }) => id);

    const payload = await Promise.all(
      _.unionBy(movies, data, "id").map(async (movie) => {
        if (ids.includes(movie.id)) {
          movie.isRecommend = true;
          const { poster_path } = await movieApi.getTmdbMovieById(movie.id);
          movie.poster_path = poster_path;
        }

        return movie;
      })
    );

    dispatch({
      type: LOAD_RECOMMENDATIONS,
      payload,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_RECOMMENDATIONS_FAIL,
    });
  }
};

export const load_owner_ratings = () => async (dispatch) => {
  try {
    const data = await movieApi.getOwnerRatings();

    const payload = await Promise.all(
      data.map(async ({ movie, rating }) => {
        const { poster_path } = await movieApi.getTmdbMovieById(movie.id);
        return {
          ...movie,
          my_rating: {
            is_rated: true,
            rating: rating,
          },
          poster_path,
        };
      })
    );

    dispatch({
      type: LOAD_OWNER_RATINGS,
      payload,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_OWNER_RATINGS_FAIL,
    });
  }
};

export const rating_movie = (movieId, rating) => async (dispatch, getState) => {
  try {
    let movies = getState().movie.results;
    await movieApi.postRatingMovie(movieId, rating);

    const payload = movies.map((movie) => {
      if (movie.id === movieId) {
        movie.my_rating.rating = rating;
        movie.my_rating.is_rated = true;
      }

      return movie;
    });

    dispatch({ type: RATING_MOVIE, payload });
  } catch (err) {
    dispatch({ type: RATING_MOVIE_FAIL });
  }
};
