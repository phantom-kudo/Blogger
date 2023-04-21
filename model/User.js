const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    minLength: 6,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  userBlogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  ],
});

userSchema.methods.generateJWT = () => {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
