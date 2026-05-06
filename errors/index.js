const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./not-found')
const ForbiddenError = require('./forbidden')
const ConflictError = require('./conflict')

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  ForbiddenError,
  ConflictError
}
