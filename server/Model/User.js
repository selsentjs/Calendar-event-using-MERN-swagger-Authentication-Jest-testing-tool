const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      
    },
    password: {
      type: String,
      required: false, // If user using Google OAuth
    },
    googleId: {
      type: String,
      required: false,  
    },
   
  },
  {
    timestamps: true,
  }
);

// Hash the user's password before saving 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);








 
