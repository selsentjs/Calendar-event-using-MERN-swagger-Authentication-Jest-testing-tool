const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

const connectDB = async() => {
    try{
        await mongoose.connect(url)
        if (process.env.NODE_ENV !== "test") {
            console.log('Connected to MongoDB');
          }
    }
    catch(err) {
        console.error('Error connecting to MongoDB:', err);
    }
   
}

connectDB();

module.exports = mongoose;