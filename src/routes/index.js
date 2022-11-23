/* eslint-disable import/no-import-module-exports */
// const userRouter = require('./user');
// const authRouter = require('./auth');

import { notFound } from '../middlewares/handleErrors';
import authRouter from './auth';
import userRouter from './user';

function route(app) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/auth', authRouter);

    app.use(notFound);
    
    // có thể return hoặc không đều chạy
    return app.use('/', (req, res) => {
        res.send('Server on');
    });
}

module.exports = route;
