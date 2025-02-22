require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoute");
const eventRouter = require("./Routes/eventRoute");
const errorHandler = require('./middleware/errorHandler');
const swaggerDocs = require('./swagger');
const app = express();

// database
require("../server/Database/db");

// middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(cookieParser(process.env.JWT_SECRET));

// route
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

// Use error handler after all routes and middleware
app.use(errorHandler);

// If we're not in testing mode, then start the server.
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      swaggerDocs(app,PORT)
    });
  }
  
  module.exports = app; // Export the app for testing purposes
