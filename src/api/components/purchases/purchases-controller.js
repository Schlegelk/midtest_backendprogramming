const purchasesService = require('./purchases-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { func } = require('joi');

/**
 * Handle get list of purchases request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getPurchases(request, response, next) {
  try {
    const purchases = await purchasesService.getPurchases();
    // const search = request.query.search;
    // const searchKey = search.split(":").at(0);
    // const searchValue = search.split(":").at(1);
    // const sort = request.query.sort;
    // const sortKey = sort.split(":").at(0);
    // const sortValue = sort.split(":").at(1);
    //
    // const pageSize = Number(request.query['page_size']);
    // const pageNumber = Number(request.query['page_number']);
    //
    // // Searching/Filter
    // const purchasesSearched = [];
    // for(let i = 0; i < purchases.length; i++) {
    //   console.log(purchases.at(i));
    //   if(purchases.at(i)[searchKey].toLowerCase().includes(searchValue.toLowerCase())) {
    //     purchasesSearched.push(purchases.at(i));
    //   }
    // }
    //
    // // Sorting
    // const purchasesSorted = [];
    // if(sortValue === 'asc') {
    //   for(let i = 0; i < purchasesSearched.length - 1; i++) {
    //     for(let j = 0; j < purchasesSearched.length - i - 1; j++) {
    //       if(purchasesSearched[j][sortKey] > purchasesSearched[j + 1][sortKey]) {
    //         let temp = purchasesSearched[j];
    //         purchasesSearched[j] = purchasesSearched[j + 1];
    //         purchasesSearched[j + 1] = temp;
    //       }
    //     }
    //   }
    // }
    // else {
    //   for(let i = 0; i < purchasesSearched.length - 1; i++) {
    //     for(let j = 0; j < purchasesSearched.length - i - 1; j++) {
    //       if(purchasesSearched[j][sortKey] < purchasesSearched[j + 1][sortKey]) {
    //         let temp = purchasesSearched[j];
    //         purchasesSearched[j] = purchasesSearched[j + 1];
    //         purchasesSearched[j + 1] = temp;
    //       }
    //     }
    //   }
    // }
    // for(let i = 0; i < purchasesSearched.length; i++) {
    //   purchasesSorted.push(purchasesSearched[i]);
    // }
    //
    // // Page Number & Page Size
    // const purchasesPaged = [];
    // const startIndex = (pageNumber - 1) * pageSize;
    // for(let i = startIndex; i < startIndex + pageSize; i++) {
    //   if(i < purchasesSorted.length) {
    //     purchasesPaged.push(purchasesSorted[i])
    //   }
    // }
    //
    // // Metadata
    // const totalPages = Math.ceil(purchasesSorted.length / pageSize);
    // const previousPage = pageNumber > 1;
    // const nextPage = pageNumber < totalPages;
    //
    // const responseObject = {
    //   page_number: pageNumber,
    //   page_size: pageSize,
    //   count: purchasesSorted.length,
    //   total_pages: totalPages,
    //   has_previous_page: previousPage,
    //   has_next_page: nextPage,
    //   data: purchasesPaged
    // };

    return response.status(200).json(purchases);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get purchase detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getPurchase(request, response, next) {
  try {
    const purchase = await purchasesService.getPurchase(request.params.id);

    if (!purchase) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown purchase');
    }

    return response.status(200).json(purchase);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create purchase request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createPurchase(request, response, next) {
  try {
    const name = request.body.name;
    const price = request.body.price;
    const quantity = request.body.quantity;

    // Name must be unique
    const nameIsRegistered = await purchasesService.nameIsRegistered(name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.NAME_ALREADY_TAKEN,
        'Name is already registered'
      );
    }

    const success = await purchasesService.createPurchase(name, price, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create purchase'
      );
    }

    return response.status(200).json({ name, price, quantity});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update purchase request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updatePurchase(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await purchasesService.updatePurchase(id, name, price, quantity);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update purchase'
      );
    }

    return response.status(200).json({name, price, quantity});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete purchase request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deletePurchase(request, response, next) {
  try {
    const id = request.params.id;

    const success = await purchasesService.deletePurchase(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete purchase'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
