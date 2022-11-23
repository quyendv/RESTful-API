/* eslint-disable import/no-import-module-exports */
import * as services from '../services';

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
        const { email, password } = req.body; // lấy từ form
        // Ktra dữ liệu nhận được: cái này có thể check ở FE hoặc BE k rõ, ở đây chỉ check tạm thôi để tránh xử lý dữ liệu bên dưới nếu k hợp lệ
        if (!email || !password) return res.status(400).json({ err: 1, mes: 'Missing payloads' });

        const response = await services.register(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Internal Server Error',
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // lấy từ form
        // Ktra dữ liệu nhận được: cái này có thể check ở FE hoặc BE k rõ, ở đây chỉ check tạm thôi để tránh xử lý dữ liệu bên dưới nếu k hợp lệ
        if (!email || !password) return res.status(400).json({ err: 1, mes: 'Missing payloads' });

        const response = await services.login(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Internal Server Error',
        });
    }
};