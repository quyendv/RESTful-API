import joi from 'joi';
import { available, category_code, image, price, title } from '../helpers/joiSchema';
import { badRequest, internalServerError } from '../middlewares/handleErrors';
import * as services from '../services';

const cloudinary = require('cloudinary').v2;

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

        const fileData = req.file; // do middleware uploader đã có gán req.file/files rồi
        const { error } = joi
            .object({ title, price, category_code, available, image })
            .validate({ ...req.body, image: fileData?.path }); // Chú ý sửa cái này
        if (error) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename); // fileData có key fileName, để xóa
            return badRequest(error.details[0].message, res);
        }

        const response = await services.createNewBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
