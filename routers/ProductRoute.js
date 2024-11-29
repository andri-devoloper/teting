const express = require("express");
const {
  getProduct,
  getProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
} = require("../controllers/ProductController");

const router = express.Router();

router.get("/product", getProduct);
router.get("/product/:id", getProductById);
router.post("/product", CreateProduct);
router.patch("/product/:id", UpdateProduct);
router.delete("/product/:id", DeleteProduct);

module.exports = router;
