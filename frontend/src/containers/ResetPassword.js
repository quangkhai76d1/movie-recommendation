import React, { Fragment, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authApi from "../api/authApi.js";

function ResetPassword() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState({
    hasErr: false,
    msg: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await authApi.resetPassword(email);
      setSent(true);
      setError({ ...error, hasErr: false });
    } catch (err) {
      setSent(false);
      setError({
        hasErr: true,
        msg:
          err.response.status === 400
            ? err.response.data[0]
            : "Can't send reset password email",
      });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Fragment>
      <h3>Sent Reset Password Email</h3>
      <form onSubmit={(e) => onSubmit(e)}>
        {error.hasErr && (
          <div className="alert alert-danger mt-3" role="alert">
            {error.msg}
          </div>
        )}
        {sent && (
          <div className="alert alert-success" role="alert">
            We have e-mail your password reset link!
          </div>
        )}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            className="form-control"
            type="email"
            placeholder="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Send Email
        </button>
      </form>
    </Fragment>
  );
}

export default ResetPassword;
