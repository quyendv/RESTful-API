const userRouter = require('./user');

function route(app) {
    app.use('/api/v1/user', userRouter);

    app.use('/', (req, res) => {
        res.send('Server on');
    });
}

module.exports = route;
