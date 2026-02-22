export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    msg: "The page you're looking for does not exist",
  });
};

export const intError = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const msg =
    err.message ||
    "An internal server error occurred. Please try again later.";

  res.status(statusCode).json({
    success: false,
    msg,
  });
};