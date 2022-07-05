import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth.js";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const guestLinks = () => (
    <Fragment>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/signup">
          Signup
        </Link>
      </li>
    </Fragment>
  );

  const authLinks = () => (
    <>
      {user ? (
        <li className="nav-item">
          <Link className="nav-link" to="/profile" onClick={() => {}}>
            <strong>{user.name}</strong>
          </Link>
        </li>
      ) : null}
      <li className="nav-item">
        <Link
          className="nav-link"
          to="/home"
          onClick={() => dispatch(logout())}
        >
          Logout
        </Link>
      </li>
    </>
  );

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/home">
            <strong>Movies Recommendation</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/home"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? authLinks() : guestLinks()}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
