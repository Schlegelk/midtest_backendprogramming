const { Purchase } = require('../../../models');

/**
 * Get a list of Purchases
 * @returns {Promise}
 */
async function getPurchases() {
  return Purchase.find({});
}

/**
 * Get Purchase detail
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function getPurchase(id) {
  return Purchase.findById(id);
}

/**
 * Create new Purchase
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createPurchase(name, price, quantity) {
  return Purchase.create({
    name,
    price,
    quantity,
  });
}

/**
 * Update existing Purchase
 * @param {string} id - Purchase ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updatePurchase(name, price, quantity) {
  return Purchase.updateOne(
    {
      _name: name,
      _price: price,
      _quantity: quantity
    },
    {
      $set: {
        name,
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a Purchase
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function deletePurchase(id) {
  return Purchase.deleteOne({ _id: id });
}

/**
 * Get Purchase by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getPurchaseByName(name) {
  return Purchase.findOne({ name });
}

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseByName,
};
