const router = require("express").Router();

const auth = require("../middleware/auth");
const clothingItemRouter = require("./clothingItem");

const userRouter = require("./users");
const NotFoundError = require("../errors/notfound");

router.use("/items", clothingItemRouter);
router.use("/", auth);
router.use("/users", userRouter);

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
