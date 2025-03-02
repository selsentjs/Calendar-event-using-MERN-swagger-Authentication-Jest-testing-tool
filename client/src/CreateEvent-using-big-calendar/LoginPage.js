import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./style.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      // Send login request to the backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/login`, { email, password });
      toast.success("Logged in successfully!");
      // Save the token in localStorage (or cookies)
      localStorage.setItem('token', response.data.token);
      // Redirect to event creation page after successful login
      navigate('/create-event');
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Login failed!";
      toast.error(errorMsg);

      // If login failed due to user not being registered, redirect to register page
      if (errorMsg === "Invalid Credentials") {
        toast.info("You are not registered. Please sign up!");
        navigate('/register');
      }
    }
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-lg p-4 rounded">
              <Card.Body>
                <h2 className="title text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <span>Don't have an account? </span>
                  <Button
                    variant="link"
                    onClick={() => navigate("/register")}
                    className="p-0"
                  >
                    Register here
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
