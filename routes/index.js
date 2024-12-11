const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { NOT_FOUND } = require("../utils/errors");
const auth = require("../middleware/auth");

const userRouter = require("./users");

router.use("/items", clothingItem);
router.use("/", auth);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
