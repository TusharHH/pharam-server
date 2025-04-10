// products.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getLowStockProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../../controllers/product');

router.get('/', getAllProducts);
router.get('/low-stock', getLowStockProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;