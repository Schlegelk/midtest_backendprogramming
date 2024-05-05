const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
let loginAttempts = {
  count: 0,
  lastAttemptTime: 0
};
const loginDisableDuration = 30 * 60 * 1000;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  const currentTime = new Date().getTime();

  try {
    // Check login attempts
    if(loginAttempts.count >= 5 && currentTime - loginAttempts.lastAttemptTime < loginDisableDuration) {
      const remainingTime = Math.ceil((loginAttempts.lastAttemptTime + loginDisableDuration - currentTime) / 1000 / 60);
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Too many failed login attempts. Please try again after ${remainingTime} minutes.`
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      loginAttempts.count++;
      loginAttempts.lastAttemptTime = currentTime;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password. Login Attempts = ${loginAttempts.count}`
      );
    }

    loginAttempts.count = 0;

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
