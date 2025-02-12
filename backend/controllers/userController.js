const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(200, user, res);
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

exports.signup = asyncHandler(async (req, res) => {
  const { email, password, name, profile_img } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(401);
    throw new Error("User already exists with given email");
  }

  const newUser = new User({
    email,
    password,
    name,
    profile_img: {
        id: 'imageId',
        url: 'image.url'
    }
  });

  const createdUser = await newUser.save()

  if (createdUser) {
    generateToken(201, createdUser, res);
  } else {
    res.status(401);
    throw new Error("Invalid user credentials");
  }
});

exports.logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now()),
  };

  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logged Out",
  });
});

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({
    success: true,
    user,
  });
});
