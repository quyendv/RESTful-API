/* eslint-disable import/no-import-module-exports */
// const userRouter = require('./user');
// const authRouter = require('./auth');

import { notFound } from '../middlewares/handleErrors';
import authRouter from './auth';
import userRouter from './user';
import insertRouter from './insert';
import bookRouter from './book';

function route(app) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/insert', insertRouter);
    app.use('/api/v1/book', bookRouter);

    app.use(notFound); // đặt ở đây có thể bỏ đoạn app.user('/', ...) đi vì nó sẽ lọt vào notFound

    // có thể return hoặc không đều chạy
    return app.use('/', (req, res) => {
        res.send('Server on');
    });
}

module.exports = route;
