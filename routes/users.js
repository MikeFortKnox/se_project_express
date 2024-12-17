const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
// router.post("/", createUser);

module.exports = router;
