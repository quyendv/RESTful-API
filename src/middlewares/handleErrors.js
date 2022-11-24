const createError = require('http-errors');

export const badRequest = (err, res) => {
    const error = createError.BadRequest(err);
    return res.status(error.status).json({
        err: 1,
        mes: error.message,
    });
};

export const internalServerError = (res) => {
    const error = createError.InternalServerError();
    return res.status(error.status).json({
        err: 1,
        mes: error.message,
    });
};

// hàm này trong app.use nên phải có cụm (req, res)
export const notFound = (req, res) => {
    const error = createError.NotFound('This route is not defined'); // các hàm trên cũng truyền được custom message vào, k thì lấy message default
    return res.status(error.status).json({
        err: 1,
        mes: error.message,
    });
};

export const notAuth = (err, res) => {
    const error = createError.Unauthorized(err);
    return res.status(error.status).json({
        err: 1,
        mes: error.message,
    });
};
