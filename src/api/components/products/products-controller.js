const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { func } = require('joi');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    const products = await productsService.getProducts();
    const search = request.query.search;
    const searchKey = search.split(":").at(0);
    const searchValue = search.split(":").at(1);
    const sort = request.query.sort;
    const sortKey = sort.split(":").at(0);
    const sortValue = sort.split(":").at(1);

    const pageSize = Number(request.query['page_size']);
    const pageNumber = Number(request.query['page_number']);

    // Searching/Filter
    const productsSearched = [];
    for(let i = 0; i < products.length; i++) {
      console.log(products.at(i));
      if(products.at(i)[searchKey].toLowerCase().includes(searchValue.toLowerCase())) {
        productsSearched.push(products.at(i));
      }
    }

    // Sorting
    const productsSorted = [];
    if(sortValue === 'asc') {
      for(let i = 0; i < productsSearched.length - 1; i++) {
        for(let j = 0; j < productsSearched.length - i - 1; j++) {
          if(productsSearched[j][sortKey] > productsSearched[j + 1][sortKey]) {
            let temp = productsSearched[j];
            productsSearched[j] = productsSearched[j + 1];
            productsSearched[j + 1] = temp;
          }
        }
      }
    }
    else {
      for(let i = 0; i < productsSearched.length - 1; i++) {
        for(let j = 0; j < productsSearched.length - i - 1; j++) {
          if(productsSearched[j][sortKey] < productsSearched[j + 1][sortKey]) {
            let temp = productsSearched[j];
            productsSearched[j] = productsSearched[j + 1];
            productsSearched[j + 1] = temp;
          }
        }
      }
    }
    for(let i = 0; i < productsSearched.length; i++) {
      productsSorted.push(productsSearched[i]);
    }

    // Page Number & Page Size
    const productsPaged = [];
    const startIndex = (pageNumber - 1) * pageSize;
    for(let i = startIndex; i < startIndex + pageSize; i++) {
      if(i < productsSorted.length) {
        productsPaged.push(productsSorted[i])
      }
    }

    // Metadata
    const totalPages = Math.ceil(productsSorted.length / pageSize);
    const previousPage = pageNumber > 1;
    const nextPage = pageNumber < totalPages;

    const responseObject = {
      page_number: pageNumber,
      page_size: pageSize,
      count: productsSorted.length,
      total_pages: totalPages,
      has_previous_page: previousPage,
      has_next_page: nextPage,
      data: productsPaged
    };

    return response.status(200).json(responseObject);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const quantity = request.body.quantity;
    const category = request.body.category;

    // Name must be unique
    const nameIsRegistered = await productsService.nameIsRegistered(name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.NAME_ALREADY_TAKEN,
        'Name is already registered'
      );
    }

    const success = await productsService.createProduct(name, description, price, quantity, category);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ name, description, price, quantity, category });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const quantity = request.body.quantity;
    const category = request.body.category;

    const success = await productsService.updateProduct(id, name, description, price, quantity, category);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({name, description, price, quantity, category});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
