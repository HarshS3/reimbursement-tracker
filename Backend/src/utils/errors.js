class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static badRequest(message, details) {
    return new AppError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new AppError(409, message);
  }

  static badGateway(message = 'Bad Gateway') {
    return new AppError(502, message);
  }

  static serviceUnavailable(message = 'Service Unavailable') {
    return new AppError(503, message);
  }

  static internal(message = 'Internal Server Error', details) {
    return new AppError(500, message, details);
  }
}

module.exports = AppError;
