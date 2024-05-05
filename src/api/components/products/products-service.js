const productsRepository = require('./products-repository');

/**
 * Get list of products
 * @returns {Array}
 */
async function getProducts() {
  const products = await productsRepository.getProducts();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    });
  }

  return results;
}

/**
 * Get product detail
 * @param {string} id - product ID
 * @returns {Object}
 */
async function getProduct(id) {
  const product = await productsRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    category: product.category
  };
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} description - Description
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @param {string} category - Category
 * @returns {boolean}
 */
async function createProduct(name, description, price, quantity, category) {

  try {
    await productsRepository.createProduct(name, description, price, quantity, category);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing product
 * @param {string} id - product ID
 * @param {string} name - Name
 * @param {string} description - Description
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @param {string} category - Category
 * @returns {boolean}
 */
async function updateProduct(id, name, description, price, quantity, category) {
  const product = await productsRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.updateProduct(name, description, price, quantity, category);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} id - product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await productsRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the name is registered
 * @param {string} name - Name
 * @returns {boolean}
 */
async function nameIsRegistered(name) {
  const product = await productsRepository.getProductByName(name);

  if (product) {
    return true;
  }

  return false;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  nameIsRegistered,
};
