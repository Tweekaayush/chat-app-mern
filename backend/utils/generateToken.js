const jwt = require("jsonwebtoken");

exports.generateToken = async (statusCode, user, res) => {

  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  res.cookie("token", token, options).status(statusCode).json({
    success: true,
    user: {...user._doc, password: undefined}
  });
};
