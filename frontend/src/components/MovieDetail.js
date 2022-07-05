import { Modal, Button, Row, Col } from "react-bootstrap";
import React, { useEffect, useMemo, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import _ from "lodash";
import ReactStars from "react-rating-stars-component";
import { load_similar_and_check_rated, rating_movie } from "../actions/movie";

const selectMoive = createSelector(
  (state) => state.movie.results,
  (_, movieId) => movieId,
  (results, movieId) => results.filter((movie) => movie.id === movieId)[0]
);

const selectSimilarMovies = createSelector(
  (state) => state.movie.results,
  (_, movieId) => movieId,
  (results, movieId) =>
    results.filter((movie) => movie.similarId?.includes(movieId))
);

const MovieDetail = ({ movieId, setShow, setMovieId }) => {
  const movie = useSelector((state) => selectMoive(state, movieId));
  const similarMovies = useSelector((state) =>
    selectSimilarMovies(state, movieId)
  );

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const {
    title,
    rating,
    release_date,
    vote_count,
    overview,
    original_language,
    runtime,
    tagline,
    genres,
    keywords,
    popularity,
  } = movie;

  const [starRating, setStarRating] = useState(5);

  useEffect(() => {
    if (similarMovies.length === 0) {
      dispatch(load_similar_and_check_rated(movieId));
    }
  }, [dispatch, movieId, similarMovies.length]);

  const renderSimilarities = useMemo(
    () =>
      similarMovies.map((movie) => {
        return (
          <span key={movie.id}>
            <Button
              size="sm"
              variant="primary"
              style={{ marginBottom: "0.8rem" }}
              onClick={() => setMovieId(movie.id)}
            >
              {movie.title}
            </Button>{" "}
          </span>
        );
      }),
    [similarMovies, setMovieId]
  );

  const renderMyRating = () => {
    if (isAuthenticated && movie.my_rating) {
      const rated = movie.my_rating.is_rated;

      return (
        <Modal.Body style={{ borderTop: "1px solid #dee2e6" }}>
          <h5>{rated ? "Your Are Rated" : "Your Rating"}</h5>
          <div className="mb-2">
            <ReactStars
              count={5}
              onChange={setStarRating}
              value={rated ? movie.my_rating.rating : starRating}
              size={30}
              isHalf={true}
              edit={rated ? false : true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </div>
          {!rated && (
            <Button
              variant="primary"
              onClick={() => dispatch(rating_movie(movieId, starRating))}
            >
              Send Rating
            </Button>
          )}
        </Modal.Body>
      );
    }
  };

  return (
    <Modal
      show={true}
      onHide={() => setShow(false)}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title ">
          {title} ({rating})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <img
              className="rounded img-fluid"
              src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={`${movie.title}-poster`}
            />
          </Col>
          <Col md={6}>
            <p>
              <strong>Release: </strong>
              <span>{release_date ? release_date : "Nan"}</span>
            </p>
            <p>
              <strong>Original Language: </strong>
              <span>{original_language}</span>
            </p>
            <p>
              <strong>Runtime: </strong>
              <span>{runtime}</span>
            </p>
            <p>
              <strong>Vote Count: </strong>
              <span>{vote_count}</span>
            </p>
            <p>
              <strong>Popularity: </strong>
              <span>{popularity}</span>
            </p>
            <p>
              <strong>Genre: </strong>
              <span>{_.join(genres, ", ")}</span>
            </p>
            <p>
              <strong>Keywords: </strong>
              <span>{_.join(keywords, ", ")}</span>
            </p>
            <h5>Tagline</h5>
            <p>{tagline ? tagline : "Nan"}</p>
            <h5>Overview</h5>
            <p>{overview ? overview : "Nan"}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Body style={{ borderTop: "1px solid #dee2e6" }}>
        <h5>Similar Movies</h5>
        {renderSimilarities}
      </Modal.Body>
      {isAuthenticated ? renderMyRating() : ""}
    </Modal>
  );
};

export default MovieDetail;
