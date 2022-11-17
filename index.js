const express = require('express');

const cors = require('cors');
require('dotenv').config();

const app = express();

/** app.use(truyền middleware mình muốn) */
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
);

/** Sau khi qua cors rồi (chạy theo thứ tự nhé) thì check tiếp */
app.use(express.json()); // convert data client gửi lên sang json
app.use(express.urlencoded({ extended: true })); // convert data sang json nhưng từ những dạng như array, object, ...

app.use('/', (req, res) => res.send('Sever On'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});
