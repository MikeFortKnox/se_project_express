const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
} = require("../controllers/users");

//router.get("/", getUsers);
router.get("/me", getCurrentUser);
//router.post("/", createUser);

module.exports = router;
