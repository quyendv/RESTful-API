// class UserController {
//     getUsers(req, res) {
//         return res.send('user controller');
//     }
// }

// module.exports = new UserController();

import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handleErrors';

export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user; // xem middleware verifyToken đã thêm key user cho request
        const response = await services.getOne(id);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
