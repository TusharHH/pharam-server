// products.controller.js
const { Product } = require('../models/products');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if(!products){
      return res.status(404).json({ message: 'No products found' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products (stock < 10)
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 10 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new product
const addProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getLowStockProducts,
  addProduct,
  updateProduct,
  deleteProduct
};