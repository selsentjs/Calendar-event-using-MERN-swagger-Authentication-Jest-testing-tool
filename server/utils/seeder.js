require("dotenv").config()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../Model/User'); // Import User model
const Event = require('../Model/Calendar'); // Import Event model
const connectDB = require("../Database/db"); // Import DB connection
// sample user data
const users = require("../data/user")
// sample event data
const events = require("../data/event")

// Seed Data Function
const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to database

    console.log(' Clearing existing data...');
    await User.deleteMany();
    await Event.deleteMany();

    console.log('Inserting sample users...');
    const createdUsers = await User.insertMany(users);

    // Assign events to the first user
    const userId = createdUsers[0]._id;
    const eventData = events.map(event => ({ ...event, userId }));

    console.log('Inserting sample events...');
    await Event.insertMany(eventData);

    console.log(' Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(' Seeding Failed:', error);
    process.exit(1);
  }
};

// Run Seeder
seedDatabase();
