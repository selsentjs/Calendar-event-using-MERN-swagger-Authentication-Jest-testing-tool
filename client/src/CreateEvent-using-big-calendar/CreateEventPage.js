import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./style.css";
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (!token) {
      toast.error("You need to log in to create an event");
      return;
    }

    // "http://localhost:5000/api/event"
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/event`,
        {
          title,
          description,
          startTime: new Date(startTime).toISOString(), // Format the time to ISO string
          endTime: new Date(endTime).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the request headers
          },
        }
      );
      console.log(response.data);
      toast.success("Event created successfully!");
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      navigate("/calendar");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create event");
    }
  };

  return (
    <div className="create-event-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-lg p-4 rounded">
              <Card.Body>
                <h2 className="title text-center mb-4">Create Event</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEventTitle">
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter event title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEventDescription">
                    <Form.Label>Event Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter event description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEventStartTime">
                    <Form.Label>Start Date & Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEventEndTime">
                    <Form.Label>End Date & Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Create Event
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateEventPage;
