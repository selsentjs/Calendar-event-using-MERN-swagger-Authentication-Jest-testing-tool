const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../Model/User");

// Generate a valid token for a mock user
const generateTokenForUser = async () => {
  const user = await User.create({
    name: "New User",
    email: `test${Date.now()}@example.com`, // Using Date.now() to generate a unique email
    password: "testpassword",
  });

  const payload = { userId: user._id, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

beforeAll(async () => {
  // Ensure the database connection is established before tests
  await mongoose.connect(process.env.MONGO_TEST_URI);
});

afterAll(async () => {
  // Clean up the test user
  await User.deleteMany({ email: /test\d+@example.com/ }); // Delete any test users created
  // Clean up after all tests are finished
  await mongoose.connection.close();
  jest.clearAllMocks();
});

// POST  /api/event
describe("POST /api/event", () => {
  it("should create a new event", async () => {
    const token = await generateTokenForUser(); // Generate a valid token
    const newEvent = {
      title: "New Event",
      startTime: "2025-03-01T10:00:00Z",
      endTime: "2025-03-01T12:00:00Z",
      description: "A new event",
      location: "New York",
    };

    const res = await request(app)
      .post("/api/event")
      .set("Authorization", `Bearer ${token}`)
      .send(newEvent);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("msg", "Event created");
    expect(res.body.event).toHaveProperty("title", "New Event");
  });
});

// In the GET /api/event endpoint handler
describe("GET /api/event", () => {
  it("should return all events", async () => {
    const res = await request(app)
      .get("/api/event")
      .set("Authorization", `Bearer ${await generateTokenForUser()}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.event)).toBe(true); // Assuming events are returned as an array
    expect(res.body.event.length).toBeGreaterThan(0); // Ensure at least one event is returned (if any exist)
  });
});

// In the GET /api/event/:id endpoint handler
describe("GET /api/event/:id", () => {
  it("should return a single event", async () => {
    // Create a user and an event for testing
    const token = await generateTokenForUser(); // Assuming this function generates a token for a user
    const newEvent = {
      title: "New Event",
      startTime: "2025-03-01T10:00:00Z",
      endTime: "2025-03-01T12:00:00Z",
      description: "A new event",
      location: "New York",
    };

    const createEventRes = await request(app)
      .post("/api/event")
      .set("Authorization", `Bearer ${token}`)
      .send(newEvent);

    // Get the event ID
    const eventId = createEventRes.body.event._id;

    // Now, test the GET /api/event/:id endpoint
    const res = await request(app)
      .get(`/api/event/${eventId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.event).toHaveProperty("title", "New Event");
    expect(res.body.event).toHaveProperty("location", "New York");
  });

  it("should return 404 if event not found", async () => {
    // Test for non-existent event ID
    const nonExistentEventId = new mongoose.Types.ObjectId(); // Generate a random ObjectId

    const res = await request(app)
      .get(`/api/event/${nonExistentEventId}`)
      .set("Authorization", `Bearer ${await generateTokenForUser()}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("msg", "Event not found");
  });
});

// update end point
describe("PUT /api/event/:id", () => {
  it("should update an event", async () => {
    // Create a user and an event for testing
    const token = await generateTokenForUser(); // Assuming this function generates a token for a user
    const newEvent = {
      title: "New Event",
      startTime: "2025-03-01T10:00:00Z",
      endTime: "2025-03-01T12:00:00Z",
      description: "A new event",
      location: "New York",
    };

    const createEventRes = await request(app)
      .post("/api/event")
      .set("Authorization", `Bearer ${token}`)
      .send(newEvent);

    // Get the event ID
    const eventId = createEventRes.body.event._id;

    // Data to update the event
    const updatedEvent = {
      title: "Updated Event",
      startTime: "2025-03-01T12:00:00Z",
      endTime: "2025-03-01T14:00:00Z",
      description: "Updated description",
      location: "Los Angeles",
    };

    // Now, test the PUT /api/event/:id endpoint
    const res = await request(app)
      .put(`/api/event/${eventId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedEvent); // Send updated event details

    expect(res.status).toBe(200);
    expect(res.body.event).toHaveProperty("title", "Updated Event");
    expect(res.body.event).toHaveProperty("location", "Los Angeles"); // update location
    expect(res.body.event).toHaveProperty("description", "Updated description");
  });

  it("should return 404 if event not found", async () => {
    // Test for non-existent event ID
    const nonExistentEventId = new mongoose.Types.ObjectId(); // Generate a random ObjectId

    const res = await request(app)
      .put(`/api/event/${nonExistentEventId}`)
      .set("Authorization", `Bearer ${await generateTokenForUser()}`)
      .send({
        title: "Non-existent Event",
        startTime: "2025-03-01T10:00:00Z",
        endTime: "2025-03-01T12:00:00Z",
        description: "This event does not exist",
        location: "Unknown",
      });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("msg", "Event not found");
  });
});

// delete end point
describe("DELETE /api/event/:id", () => {
  it("should delete an event", async () => {
    // Create a user and an event for testing
    const token = await generateTokenForUser(); // Assuming this function generates a token for a user

    const newEvent = {
        title: "Event to be deleted",
        startTime: "2025-03-01T10:00:00Z",
        endTime: "2025-03-01T12:00:00Z",
        description: "This event will be deleted",
        location: "New York",
      };

    const createEventRes = await request(app)
      .post("/api/event")
      .set("Authorization", `Bearer ${token}`)
.send(newEvent); // Send the event data
    // Get the event ID
    const eventId = createEventRes.body.event._id;

    // Now, test the DELETE /api/event/:id endpoint
    const res = await request(app)
      .delete(`/api/event/${eventId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.event).toHaveProperty("title", "Event to be deleted");
  });

  it("should return 404 if event not found", async () => {
    // Test for non-existent event ID
    const nonExistentEventId = new mongoose.Types.ObjectId(); // Generate a random ObjectId

    const res = await request(app)
      .delete(`/api/event/${nonExistentEventId}`)
      .set("Authorization", `Bearer ${await generateTokenForUser()}`)
      
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("msg", "Event not found");
  });
});
