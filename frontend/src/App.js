import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./hocs/Layout";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import UserPage from "./containers/UserPage";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticated, load_user } from "./actions/auth";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.access);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (token) {
      dispatch(checkAuthenticated());
      dispatch(load_user());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signu" element={<Signup />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/profile" element={<UserPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
