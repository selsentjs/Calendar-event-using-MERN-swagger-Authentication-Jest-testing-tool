const User = require("../Model/User");
const { createJWT, attachCookiesToResponse } = require("../utils/jwt");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return res.status(400).json({ msg: "Email already exists" });
  }

  // create new user
  const user = new User({
    name,
    email,
    password,
  });
  await user.save();

  const tokenUser = { name: user.name, userId: user._id };
  
  // Create JWT token
  const token = createJWT({ payload: tokenUser });

  // Attach the token to the response cookies
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(200).json({ user: tokenUser, token: token });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }
  const tokenUser = { name: user.name, userId: user._id };
  const token = createJWT({ payload: tokenUser });

  // Attach the token to the response cookies
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(200).json({ user: tokenUser, token: token });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};
