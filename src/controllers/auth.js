/* eslint-disable import/no-import-module-exports */
import joi from 'joi';
import { email, password, refreshToken } from '../helpers/joiSchema';
import { badRequest, internalServerError } from '../middlewares/handleErrors';
import * as services from '../services';

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
        return internalServerError(res);
    }
};

export const refreshTokenController = async (req, res) => {
    try {
        const { error } = joi.object({ refreshToken }).validate(req.body);
        if (error) return badRequest(error.details[0]?.message, res);

        const response = await services.refreshToken(req.body.refreshToken); // chỗ này nếu truyền req.body rồi bên service dùng destructuring thì buộc phải đúng key refreshToken, còn nếu truyền .body.refreshToken thì bên kia đặt tên gì cũng đc vì nó là biến của hàm
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
