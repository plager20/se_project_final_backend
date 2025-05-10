const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const NotFoundError = require("../errors/notfound");
const {
  validateUserInfoBody,
  validateUserLogInBody,
} = require("../middlewares/validation");

router.post("/signin", validateUserLogInBody, login);
router.post("/signup", validateUserInfoBody, createUser);

router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

module.exports = router;
