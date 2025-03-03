require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoute");
const eventRouter = require("./Routes/eventRoute");
const errorHandler = require('./middleware/errorHandler');
const swaggerDocs = require('./swagger');
const path=require('path')
const app = express();

// database
const connectDB = require("../server/Database/db"); 
connectDB(); // Call the function

// middleware
app.use(express.json());
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(cookieParser(process.env.JWT_SECRET));

// route
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

// Serve frontend files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

}
// Use error handler after all routes and middleware
app.use(errorHandler);


// If we're not in testing mode, then start the server.
if (process.env.NODE_ENV === "production") {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      swaggerDocs(app,PORT)
    });
  }
  
  module.exports = app; // Export the app for testing purposes
