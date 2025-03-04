const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middleware/validation");

// router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUser);
// router.post("/", createUser);

module.exports = router;
