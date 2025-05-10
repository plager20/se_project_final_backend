const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflict");
const BadRequestError = require("../errors/badrequest");
const NotFoundError = require("../errors/notfound");
const UnauthorizedError = require("../errors/unauthorized");

const createUser = (req, res, next) => {
  const { email, password, username } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email already exists"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      if (!hashedPassword) return null;

      return User.create({ username, email, password: hashedPassword });
    })
    .then((user) => {
      if (user) {
        const userObject = user.toObject();
        delete userObject.password;
        res.status(201).send(userObject);
      }
    })
    .catch((err) => {
      console.error("An error occured while creating user", err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Bad request error"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect username or password"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user?._id;
  User.findById(userId)
    .orFail()
    .select("-password")
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("User not found"));
      }
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };
