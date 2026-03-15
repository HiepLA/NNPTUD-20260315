var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')

// Read all products
router.get('/', async function (req, res, next) {
  try {
    // Read all: no query filter
    let products = await productModel.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// Read single product by id
router.get('/:id', async function (req, res, next) {
  try {
    let product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/', async function (req, res, next) {
  try {
    let newProduct = new productModel(req.body);
    let saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/:id', async function (req, res, next) {
  try {
    let updated = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/:id', async function (req, res, next) {
  try {
    // soft delete by default
    let deleted = await productModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted', product: deleted });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
