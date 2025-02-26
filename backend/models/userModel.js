const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_img: {
      id: { 
        type: String,
        required: true 
        },
      url: { 
        type: String, 
        required: true 
        },
    },
    status: {
      type: String,
      default: "Hey there, I am using chat app!",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    blockList: [
      {type: mongoose.Schema.Types.ObjectId}
    ]
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("methods");
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
