import axiosClient from "./axiosClient";
const getMovies = (params) => {
  const url = "api/movies/";
  return axiosClient.get(url, {
    params: params,
  });
};

const getGenres = (name) => {
  const url = "api/genres/";
  return axiosClient.get(url, {
    params: {
      name__icontains: name,
    },
  });
};

const getKeys = (key) => {
  const url = "api/keywords/";
  return axiosClient.get(url, {
    params: {
      key__icontains: key,
    },
  });
};

const getSimilarMovies = (id) => {
  const url = `api/movies/${id}/similarities/`;
  return axiosClient.get(url);
};

const checkMovieRatedByUser = (id) => {
  const url = `api/movies/${id}/is-rated/`;
  return axiosClient.get(url);
};

const postRatingMovie = (id, rating) => {
  const url = `api/movies/${id}/ratings/`;
  return axiosClient.post(url, {
    rating,
  });
};

const getOwnerRatings = () => {
  const url = `api/movies/ratings/`;
  return axiosClient.get(url);
};

const getMovieRecommendations = () => {
  const url = `api/recommendations/`;
  return axiosClient.get(url);
};

const getTmdbMovieById = (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=f3c3a6bc32ae3bd3136a5ff18ece513e`;
  return axiosClient.get(url);
};

const movieApi = {
  getMovies,
  getGenres,
  getKeys,
  getSimilarMovies,
  checkMovieRatedByUser,
  postRatingMovie,
  getOwnerRatings,
  getMovieRecommendations,
  getTmdbMovieById,
};

export default movieApi;
