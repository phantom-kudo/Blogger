const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { name, password, number } = req.body;
  if (!name) {
    return res.status(400).json({
      message: "Please provide name",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Please provide password",
    });
  }
  if (!number) {
    return res.status(400).json({
      message: "Please provide number",
    });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ number });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists!",
    });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    password: hashedPassword,
    number,
  });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({
    userDetails: {
      user,
    },
  });
};

const signIn = async (req, res) => {
  const { number, email, password } = req.body;
  if (!number) {
    return res.status(400).json({
      message: "Please provide number",
    });
  }
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Please provide password",
    });
  }
  let user;
  try {
    user = await User.findOne({ number });
    if (!user) {
      return res.status(400).json({
        message: "user not found, Please signup before proceeding.",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
      } else {
        const payload = { number: number };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            if (err) {
              return res.status(500).send(err);
            }
            return res.status(200).json({
              message: "User logged in",
              token: token,
              user: {
                user,
              },
              newLogin: user.email === "NA" ? true : false,
            });
          }
        );
        user.isAccountVerified = true;
        user.email = email;
        await user.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { signUp, signIn };
