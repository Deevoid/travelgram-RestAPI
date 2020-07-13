const throwError = require("../models/throwError");
const validateSignup = require("../models/validateSignup");
const validateLogin = require("../models/validateLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userdb");

const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.find({}, "name email").exec();
  } catch (error) {
    return next(new throwError("no users found", 404));
  }
  if (user.length <= 0) {
    res.status(404).json("No users found");
  }
  res.json({ user: user.map((u) => u.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;
  let getUser;
  try {
    getUser = await User.findById(userId);
  } catch (error) {
    return next(new throwError("Cannot find user", 404));
  }

  res.json({ getUser: getUser.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const { errors, isValid } = validateSignup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { name, email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (error) {
    return next(new throwError("Signup failed", 500));
  }
  if (user) {
    return next(new throwError("User already exist.Please Login", 422));
  }
  const createdUser = new User({
    name,
    email,
    password,
  });

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      return next(new throwError("Could not save user to database.", 500));
    }
    createdUser.password = hash;
    createdUser
      .save()
      .then((signedUser) => res.status(200).json(signedUser))
      .catch((err) => next(new throwError("Please try again later", 400)));
  });
};

const login = (req, res, next) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "Invalid User" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
        };
        jwt.sign(
          payload,
          process.env.secretOrkey,
          { expiresIn: 55555 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token,
            });
          }
        );
      } else {
        return res.status(400).json({ message: "Password Incorrect" });
      }
    });
  });
};

module.exports = {
  getUser: getUser,
  getUserById: getUserById,
  signup: signup,
  login: login,
};
