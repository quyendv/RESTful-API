import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { notAuth } from './handleErrors';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization; // nhớ đúng chính tả
    if (!token) return notAuth('Required authorization', res); // ở đây là k có token

    const accessToken = token.split(' ')[1]; // vì access_token gửi lên có dạng 'Bearer jsonwebtoken.vv...'
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        // tự xem cú pháp verify, đối số thứ 3 là cb chứa err và decode (ở đây là thông tin user)

        // Chú ý: nếu có lỗi mới ktra nó là lỗi gì, vì nếu k có lỗi err là null, check instanceof bên dưới luôn false
        if (err) {
            const isExpired = err instanceof TokenExpiredError;
            // Nếu là lỗi token k hợp lệ
            if (!isExpired) return notAuth('Access token is invalid', res, isExpired); // ở đây là có token nhưng k hợp lệ, kiểu mã hóa ra mà k đúng gì đó ấy
            // Nếu lỗi token hết hạn
            if (isExpired) return notAuth('Access token is expired', res, isExpired);
        }

        req.user = user; // tạo thêm key cho req, và dùng req.user trong controllers/user hàm getCurrent
        next(); // vì hàm này viết ở trong routes/user làm middleware xác thực token trước khi login, ... nên phải có next mới chuyển sang hàm tiếp được.
        // Chú ý trong app.use, app.get, ... các middleware dùng đều phải có nhận param (req, res) và next nếu là trung gian
    });
};

export default verifyToken;
// module.exports = verifyToken; // thống nhất 1 kiểu thôi, export es6 thì import theo es6, còn k phải require theo es5 rồi .default
// link vấn đề: https://stackoverflow.com/questions/40294870/module-exports-vs-export-default-in-node-js-and-es6
