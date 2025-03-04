const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  createItem,
  getItems,
  updateLike,
  deleteItem,
  deleteLike,
} = require("../controllers/clothingItem");
const { validateCardBody, validateId } = require("../middleware/validation");

// CRUD

// Read

router.get("/", getItems);

// import auth and set up a middleware for it
router.use("/", auth);

// Create
router.post("/", validateCardBody, createItem);

// Update

// router.put("/:itemId", updateItem);
router.put("/:itemId/likes", validateId, updateLike);

// Delete

router.delete("/:itemId", validateId, deleteItem);
router.delete("/:itemId/likes", validateId, deleteLike);

module.exports = router;
