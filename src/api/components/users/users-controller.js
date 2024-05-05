const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { func } = require('joi');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    const search = request.query.search;
    const searchKey = search.split(":").at(0);
    const searchValue = search.split(":").at(1);
    const sort = request.query.sort;
    const sortKey = sort.split(":").at(0);
    const sortValue = sort.split(":").at(1);

    const pageSize = Number(request.query['page_size']);
    const pageNumber = Number(request.query['page_number']);

    // Searching/Filter
    const usersSearched = [];
    for(let i = 0; i < users.length; i++) {
        if(users.at(i)[searchKey].toLowerCase().includes(searchValue.toLowerCase())) {
          usersSearched.push(users.at(i));
        }
    }

    // Sorting
    const usersSorted = [];
    if(sortValue === 'asc') {
      for(let i = 0; i < usersSearched.length - 1; i++) {
        for(let j = 0; j < usersSearched.length - i - 1; j++) {
          if(usersSearched[j][sortKey] > usersSearched[j + 1][sortKey]) {
            let temp = usersSearched[j];
            usersSearched[j] = usersSearched[j + 1];
            usersSearched[j + 1] = temp;
          }
        }
      }
    }
    else {
      for(let i = 0; i < usersSearched.length - 1; i++) {
        for(let j = 0; j < usersSearched.length - i - 1; j++) {
          if(usersSearched[j][sortKey] < usersSearched[j + 1][sortKey]) {
            let temp = usersSearched[j];
            usersSearched[j] = usersSearched[j + 1];
            usersSearched[j + 1] = temp;
          }
        }
      }
    }
    for(let i = 0; i < usersSearched.length; i++) {
      usersSorted.push(usersSearched[i]);
    }

    // Page Number & Page Size
    const usersPaged = [];
    const startIndex = (pageNumber - 1) * pageSize;
    for(let i = startIndex; i < startIndex + pageSize; i++) {
      if(i < usersSorted.length) {
        usersPaged.push(usersSorted[i])
      }
    }

    // Metadata
    const totalPages = Math.ceil(usersSorted.length / pageSize);
    const previousPage = pageNumber > 1;
    const nextPage = pageNumber < totalPages;

    const responseObject = {
      page_number: pageNumber,
      page_size: pageSize,
      count: usersSorted.length,
      total_pages: totalPages,
      has_previous_page: previousPage,
      has_next_page: nextPage,
      data: usersPaged
    };

    return response.status(200).json(responseObject);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
