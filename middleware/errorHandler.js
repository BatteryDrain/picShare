export const intError = (err, res) => {
console.error(err);

const statusCode = err.statusCode || 500;
 const msg = err.msg || "An internal server error occurred. Please try again later.";
  res.status(statusCode).json({
    success: false,
    msg,
  });
};

export const notFound = (err, res) => {
console.error(err);

const statusCode = err.statusCode || 404;
  const msg = err.msg || "The page your looking for does not exist";
  res.status(statusCode).json({
    success: false,
    msg,
  });
};
