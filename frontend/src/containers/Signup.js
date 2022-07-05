import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import authApi from "../api/authApi";

const Signup = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    re_password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await authApi.signup(
        formData.email,
        formData.name,
        formData.password,
        formData.re_password
      );

      setError(false);
      setSuccess(false);
    } catch (err) {
      setError(Object.values(err.response.data)[0][0]);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Row className="justify-content-center">
      <Col md={4}>
        <h1 className="text-center">SIGN UP</h1>
        <Form noValidate onSubmit={onSubmit}>
          <Form.Group className="mt-3" controlId="validateionName">
            <Form.Label>
              <strong>User Name</strong>
            </Form.Label>
            <Form.Control
              name="name"
              type="text"
              value={formData.name}
              required
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mt-3" controlId="validationEmail">
            <Form.Label>
              <strong>Email</strong>
            </Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              required
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mt-3" controlId="validationPassword">
            <Form.Label>
              <strong>Password</strong>
            </Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formData.password}
              required
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mt-3" controlId="validationRePasswor">
            <Form.Label>
              <strong>Confirm Password</strong>
            </Form.Label>
            <Form.Control
              name="re_password"
              type="password"
              value={formData.re_password}
              required
              onChange={onChange}
            />
          </Form.Group>

          <Button className="mt-3 w-100" type="submit" variant="primary">
            <strong>Signup</strong>
          </Button>

          {error && (
            <Alert
              className="mt-3 text-center text-capitalize"
              variant="danger"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              className="mt-3 text-center text-capitalize"
              variant="success"
            >
              Your account has been success created. Activate your account by
              email.
            </Alert>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default Signup;
