const { Product } = require('../../../models');

/**
 * Get a list of Products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get Product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new Product
 * @param {string} name - Name
 * @param {string} description - Description
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @param {string} category - Category
 * @returns {Promise}
 */
async function createProduct(name, description, price, quantity, category) {
  return Product.create({
    name,
    description,
    price,
    quantity,
    category
  });
}

/**
 * Update existing Product
 * @param {string} id - Product ID
 * @param {string} name - Name
 * @param {string} description - Description
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @param {string} category - Category
 * @returns {Promise}
 */
async function updateProduct(name, description, price, quantity, category) {
  return Product.updateOne(
    {
      _name: name,
      _description: description,
      _price: price,
      _quantity: quantity,
      _category: category
    },
    {
      $set: {
        name,
        description,
        price,
        quantity,
        category
      },
    }
  );
}

/**
 * Delete a Product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Get Product by name to prevent duplicate name
 * @param {string} name - Name
 * @returns {Promise}
 */
async function getProductByName(name) {
  return Product.findOne({ name });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByName,
};
