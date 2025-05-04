const Product = require('../models/Product');

// @desc    Buscar todos os produtos
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Buscar produto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
};