import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { load_owner_ratings, load_recommendations } from "../actions/movie";
import MovieCard from "../components/MoiveCard";
import MovieDetail from "../components/MovieDetail";

const UserPage = () => {
  const ownerRatings = useSelector((state) =>
    state.movie.results.filter(({ my_rating }) => my_rating?.is_rated)
  );
  const recommedations = useSelector((state) =>
    state.movie.results.filter(({ isRecommend }) => isRecommend)
  );

  const dispatch = useDispatch();

  const [showDetail, setShowDetail] = useState(false);
  const [movieDetailId, setMovieDetailId] = useState(null);

  useEffect(() => {
    dispatch(load_owner_ratings());
  }, [dispatch]);

  const renderOwnerRatings = useMemo(() => {
    if (ownerRatings.length) {
      return (
        <Row className="g-4 mt-3">
          {ownerRatings.map((movie) => (
            <Col key={movie.id} md={3}>
              <h5 className="text-center">
                Your Rating {movie.my_rating.rating}
              </h5>
              <MovieCard
                movie={movie}
                setShowDetail={setShowDetail}
                setMovieDetailId={setMovieDetailId}
              />
            </Col>
          ))}
        </Row>
      );
    }
    return (
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h5 className="mt-3 mb-3">You don't have any movie rating</h5>
        </Col>
      </Row>
    );
  }, [ownerRatings]);

  const renderRecommendations = () => {
    if (recommedations.length) {
      return (
        <Row className="g-4 mt-3">
          {recommedations.map((movie) => (
            <Col key={movie.id} md={3}>
              <MovieCard
                movie={movie}
                setShowDetail={setShowDetail}
                setMovieDetailId={setMovieDetailId}
              />
            </Col>
          ))}
        </Row>
      );
    }
  };

  return (
    <div>
      <h3 className="mb-4 mt-4 text-center">Your Ratings</h3>
      {renderOwnerRatings}
      {showDetail && (
        <MovieDetail
          movieId={movieDetailId}
          setMovieId={setMovieDetailId}
          setShow={setShowDetail}
        />
      )}
      {ownerRatings.length && (
        <>
          <Button
            variant="primary"
            className="mt-5"
            onClick={() => dispatch(load_recommendations())}
          >
            {recommedations.length
              ? "Re-Show Recommendations"
              : "Show Recommedations"}
          </Button>
          {renderRecommendations()}
        </>
      )}
    </div>
  );
};

export default UserPage;
