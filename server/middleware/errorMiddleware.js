//Error handler middleware
const errorHandler = (error, req, res, next) => {

    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message ? error.message : "Something went wrong! Please try again after some time";

    res.status(statusCode).json({ message });
}

module.exports = errorHandler