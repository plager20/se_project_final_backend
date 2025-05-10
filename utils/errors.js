const ERROR_CODES = {
  BAD_REQUEST: 400, // Invalid data passed
  UNAUTHORIZED: 401, // Invalid Authorization
  FORBIDDEN: 403, // Invalid Action
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409,
  SERVER_ERROR: 500, // Default server error
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request in data or syntax.",
  UNAUTHORIZED: "Authentification required",
  FORBIDDEN: "You are not authorized to perorm this action.",
  NOT_FOUND: "The request was sent to a non-existent address.",
  SERVER_ERROR: "An error has occurred on the server.",
  INVALID_ID_FORMAT: "Invalid ID format.",
  MISSING_OWNER: "Owner ID is missing from the request.",
  MISSING_FIELDS: "Missing required fields: name, weather, imageUrl.",
};

const handleError = (err, res) => {
  console.error(err);
  if (err.name === "ValidationError") {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }
  if (err.name === "CastError") {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID_FORMAT });
  }
  if (err.name === "DocumentNotFoundError") {
    return res
      .status(ERROR_CODES.NOT_FOUND)
      .send({ message: ERROR_MESSAGES.NOT_FOUND });
  }
  return res
    .status(ERROR_CODES.SERVER_ERROR)
    .send({ message: ERROR_MESSAGES.SERVER_ERROR });
};

module.exports = { ERROR_CODES, ERROR_MESSAGES, handleError };
