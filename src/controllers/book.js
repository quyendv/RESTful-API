import joi from 'joi';
import { available, category_code, image, price, title } from '../helpers/joiSchema';
import { badRequest, internalServerError } from '../middlewares/handleErrors';
import * as services from '../services';

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const createNewBook = async (req, res) => {
    try {
        // if (!req.body.title || !req.body.price || !req.body.available || !req.body.category_code || !req.body.image) {
        //     return res.status(400).json({
        //         err: 1,
        //         mes: 'Missing input',
        //     });
        // }

        const { error } = joi.object({ title, price, category_code, available, image }).validate(req.body);
        if (error) return badRequest(error.details[0].message, res);

        const response = await services.createNewBook(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
