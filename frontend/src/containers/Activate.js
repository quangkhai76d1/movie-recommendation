import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authApi from "../api/authApi";

function Activate() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    hasErr: false,
    msg: "",
  });

  const { uid, token } = useParams();

  useEffect(() => {
    const activate = async () => {
      setLoading(true);

      try {
        await authApi.activateUser(uid, token);
        setError({ msg: "", hasErr: false });
      } catch (err) {
        setError({
          hasErr: true,
          msg: "co loi",
        });
      }
    };

    activate();
    setLoading(false);
  }, [uid, token]);

  if (loading) return <h3>Loading...</h3>;

  return error.hasErr ? (
    <div class="alert alert-danger" role="alert">
      {error.msg}
    </div>
  ) : (
    <div class="alert alert-success" role="alert">
      You account is activated. <Link to="/login">Login now!</Link>
    </div>
  );
}
export default Activate;
