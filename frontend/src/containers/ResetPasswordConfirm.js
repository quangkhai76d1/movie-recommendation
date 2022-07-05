import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import authApi from "../api/authApi.js";

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    hasErr: false,
    msg: "",
  });

  const { uid, token } = useParams();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await authApi.resetPasswordConfirm(uid, token, password, confirmPassword);
      setSuccess(true);
      setError({ ...error, hasErr: false });
    } catch (err) {
      setError({
        hasErr: true,
        msg: err.message,
      });
      setSuccess(false);
    }
  };

  return (
    <Fragment>
      <h3>Reset Password</h3>
      <form onSubmit={(e) => onSubmit(e)}>
        {error.hasErr && (
          <div className="alert alert-danger mt-3" role="alert">
            {error.msg}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            Password has been reset successfully!{" "}
            <Link to="/login">Login Now</Link>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            New Password
          </label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password-confirm">
            Confirm New Password
          </label>
          <input
            className="form-control"
            type="password"
            id="password-confirm"
            name="passwordConfirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Reset
        </button>
      </form>
    </Fragment>
  );
};

export default ResetPasswordConfirm;
