import React, { Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Search from "../components/Search";
import PaginationItems from "../components/PaginationItems";
import MovieDetail from "../components/MovieDetail";
import MovieCard from "../components/MoiveCard";

const Home = () => {
  const movies = useSelector((state) =>
    state.movie.results.filter(({ show }) => show)
  );

  const [showDetail, setShowDetail] = useState(false);
  const [movieDetailId, setMovieDetailId] = useState(null);

  const renderMovieDetail = () => {
    return (
      <MovieDetail
        movieId={movieDetailId}
        setShow={setShowDetail}
        setMovieId={setMovieDetailId}
      />
    );
  };

  const renderListMovies = () => {
    if (movies.length) {
      return (
        <Fragment>
          <Row md={4} className="g-4 mt-3">
            {movies.map((movie) => (
              <Col key={movie.id}>
                <MovieCard
                  movie={movie}
                  setShowDetail={setShowDetail}
                  setMovieDetailId={setMovieDetailId}
                />
              </Col>
            ))}
          </Row>
          <Row className="mt-4 justify-content-center mb-5">
            <Col md="auto">
              <PaginationItems />
            </Col>
          </Row>
          {showDetail ? renderMovieDetail() : null}
        </Fragment>
      );
    }

    return <div>Search movies by input</div>;
  };

  return (
    <div>
      <Search />
      {renderListMovies()}
    </div>
  );
};
export default Home;
