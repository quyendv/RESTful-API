import joi from 'joi';
import { available, bid, bids, category_code, image, price, title } from '../helpers/joiSchema';
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
            if (fileData) cloudinary.uploader.destroy(fileData.filename); // fileData có key fileName, để xóa nếu có lỗi từ input (thiếu required, invalid) thì xóa ảnh vừa up đi khỏi cloudinary vì có tạo được đâu mà up lên cloud
            return badRequest(error.details[0].message, res);
        }

        const response = await services.createNewBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const updateBook = async (req, res) => {
    try {
        const fileData = req.file;
        const { error } = joi.object({ bid }).validate({ bid: req.body.bid }); // đoạn này validate chỉ check rule được những fieldRule nào truyền vào phần .object trước đó thì phải, nên truyền nhiều value khác vào validate sẽ lỗi

        if (error) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename); // filename not fileName
            return badRequest(error.details[0].message, res);
        }

        const response = await services.updateBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { error } = joi.object({ bids }).validate(req.query); // hoặc {bids: req.query.bids} , do để bids dưới dạng params, còn query là dạng ?...=...
        // Phân biệt query hay params: https://stackoverflow.com/questions/14417592/node-js-difference-between-req-query-and-req-params
        if (error) {
            return badRequest(error.details[0].message, res);
        }

        const response = await services.deleteBook(req.query); // not .params // Lưu ý chỗ này truyền query thì service phải destructuring lấy bids, hoặc truyền thẳng req.query.bids thì service lấy (bids) bth
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
