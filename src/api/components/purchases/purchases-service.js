const purchasesRepository = require('./purchases-repository');

/**
 * Get list of purchases
 * @returns {Array}
 */
async function getPurchases() {
  const purchases = await purchasesRepository.getPurchases();

  const results = [];
  for (let i = 0; i < purchases.length; i += 1) {
    const purchase = purchases[i];
    results.push({
      id: purchase.id,
      name: purchase.name,
      price: purchase.price,
      quantity: purchase.quantity,
    });
  }

  return results;
}

/**
 * Get purchase detail
 * @param {string} id - purchase ID
 * @returns {Object}
 */
async function getPurchase(id) {
  const purchase = await purchasesRepository.getPurchase(id);

  // purchase not found
  if (!purchase) {
    return null;
  }

  return {
    id: purchase.id,
    name: purchase.name,
    price: purchase.price,
    quantity: purchase.quantity,
  };
}

/**
 * Create new purchase
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createPurchase(name, price, quantity) {

  try {
    await purchasesRepository.createPurchase(name, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing purchase
 * @param {string} id - purchase ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updatePurchase(id, name, price, quantity) {
  const purchase = await purchasesRepository.getPurchase(id);

  // purchase not found
  if (!purchase) {
    return null;
  }

  try {
    await purchasesRepository.updatePurchase(name, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete purchase
 * @param {string} id - purchase ID
 * @returns {boolean}
 */
async function deletePurchase(id) {
  const purchase = await purchasesRepository.getPurchase(id);

  // purchase not found
  if (!purchase) {
    return null;
  }

  try {
    await purchasesRepository.deletePurchase(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the name is registered
 * @param {string} name - Email
 * @returns {boolean}
 */
async function nameIsRegistered(name) {
  const purchase = await purchasesRepository.getPurchaseByName(name);

  if (purchase) {
    return true;
  }

  return false;
}

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  nameIsRegistered,
};
