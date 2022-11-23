/* eslint-disable import/no-import-module-exports */
import joi from 'joi';
import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handleErrors';
import { email, password } from '../helpers/joiSchema';

// class AuthController {
//     async register(req, res) {
//         try {
//             const response = await services.register();
//             return res.status(200).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 err: -1,
//                 mes: 'Internal Server Error',
//             });
//         }
//     }
// }

// module.exports = new AuthController();

export const register = async (req, res) => {
    try {
        // Ktra dữ liệu nhận được: cái này có thể check ở FE hoặc BE k rõ, ở đây chỉ check tạm thôi để tránh xử lý dữ liệu bên dưới nếu k hợp lệ
        // const { email, password } = req.body; // lấy từ form
        // if (!email || !password) return res.status(400).json({ err: 1, mes: 'Missing payloads' });

        const { error } = joi.object({ email, password }).validate(req.body); // chú ý đoạn này trả về object chứa key value (obj) là các thông tin đưa vào validate, và nếu có lỗi sẽ có key error là object chứa các lỗi -> dùng destructuring { error } xem có lỗi k
        if (error) return badRequest(error.details[0]?.message, res); // clg thử khi req lỗi ra xem thử (clg ra error chứ k phải { error } đâu nhé)

        const response = await services.register(req.body);
        return res.status(200).json(response);
    } catch (error) {
        // return res.status(500).json({
        //     err: -1,
        //     mes: 'Internal Server Error',
        // });
        return internalServerError(res);
    }
};

export const login = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate(req.body); // chú ý đoạn này trả về object chứa key value (obj) là các thông tin đưa vào validate, và nếu có lỗi sẽ có key error là object chứa các lỗi -> dùng destructuring { error } xem có lỗi k
        if (error) return badRequest(error.details[0]?.message, res); // clg thử khi req lỗi ra xem thử (clg ra error chứ k phải { error } đâu nhé)
        
        const response = await services.login(req.body);
        return res.status(200).json(response);
    } catch (error) {
        // return res.status(500).json({
        //     err: -1,
        //     mes: 'Internal Server Error',
        // });
        return internalServerError(res);
    }
};
