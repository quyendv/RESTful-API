import * as services from '../services';
import { internalServerError } from '../middlewares/handleErrors';

export const insertData = async (req, res) => {
    try {
        const response = await services.insertData();
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
