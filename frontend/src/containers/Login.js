import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../actions/auth";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password));
  };

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <Row className="justify-content-center">
      <Col md={4}>
        <h1 className="text-center">LOGIN</h1>
        <Form noValidate onSubmit={onSubmit}>
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

          <Button className="mt-3 w-100" type="submit" variant="primary">
            <strong>Login</strong>
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
