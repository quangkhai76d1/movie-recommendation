import React from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { change_movies_page } from "../actions/movie";

const movies_per_page = 20;

const PaginationItems = () => {
  const { count, current } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="Next"
      previousLabel="Prev"
      pageCount={Math.ceil(count / movies_per_page)}
      onPageChange={(e) => {
        dispatch(change_movies_page(e.selected + 1));
      }}
      forcePage={current - 1}
      pageRangeDisplayed={10}
      className="pagination"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      disabledClassName="disabled"
      disabledLinkClassName="page-link"
      activeClassName="active"
      activeLinkClassName="page-link"
    />
  );
};

export default PaginationItems;
