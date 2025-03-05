const BadRequestError = require("../errors/badrequest");
const ForbiddenError = require("../errors/forbidden");
const NotFoundError = require("../errors/notfound");
const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const { DEFAULT } = require("../utils/errors");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST).send({ message: "Invalid request" });
        return next(new BadRequestError("Invalid request"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(DEFAULT);
      return next(err);
      // .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // return res.status(NOT_FOUND).send({ message: "Item not found" });
        return next(new NotFoundError("Item not found"));
      }
      if (item.owner.equals(req.user._id)) {
        return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
          res.status(200).send({ data: deletedItem })
        );
      }
      // return res
      //   .status(FORBIDDEN)
      //   .send({ message: "You may not delete another users item" });
      return next(new ForbiddenError("You may not delete another users item"));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
        return next(new BadRequestError("Invalid ID format"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occurred on the server" });
      return next(err);
    });
};

const updateLike = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: err.message });
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("Item not found"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occurred on the server" });
      return next(err);
    });
};

const deleteLike = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: err.message });
        return next(new BadRequestError("Item not found"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("Item not found"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occurred on the server" });
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  updateLike,
  deleteLike,
};
