import AppError from '../utils/appError.js';
import 'colors';

const handleCastErrorInDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsInDB = (err) => {
  const message = `Duplicate field value: "${err.keyValue.name}". Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorsInDB = (err) => {
  const errors = Object.values(err.errors).map((curr) => curr.message);

  const message = `Invalid input data. ${errors.join('. ')}.`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details to clients
  console.error('Error'.red.bold.inverse, err);

  // Sends generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong... :(',
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.kind === 'ObjectId') {
      error = handleCastErrorInDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsInDB(error);
    }

    if (error._message === 'Validation failed') {
      error = handleValidationErrorsInDB(error);
    }

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }

  next();
};

export default globalErrorHandler;
