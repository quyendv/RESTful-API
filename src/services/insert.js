/* eslint-disable no-async-promise-executor */
import db from '../models';
import data from '../../data/data.json';
import { generateCode } from '../helpers/fn';

export const insertData = () =>
    new Promise(async (resolve, reject) => {
        try {
            const categories = Object.keys(data);
            // Insert Categories: Có thể dùng create in bulk thay thế cho cách lặp từng phần tử thêm vào bên dưới
            categories.forEach(async (item) => {
                await db.Category.create({
                    code: generateCode(item),
                    value: item,
                });
            });

            // Insert Books: đây là làm tạm với file có sẵn trong project, còn thực tế phải là client gửi lên
            /**
             * data dạng: { typeBook1: [bookItem, bookItem, ...], typeBook2: [bookItem, bookItem, ...], ...}
             * bookItem: {bookTitle: valueBookTitle, bookPrive: valueBookPrice, ...}
             * Object.entries là biến đổi objA{ key1: value1, key2: value2, key3: value3 ...} => Array dạng [[key1, value1], [key2, value2], [key3, value3], ...]
             * => entries(data) thành [[typeBook1, listBookItem1], [typeBook2, listBookItem2], ...]
             */
            const dataEntryList = Object.entries(data);
            dataEntryList.forEach((entry) => {
                // entry: [typeBook, listBookItem dạng arr [obj1, obj2, obj3, ...] đó]
                entry[1].forEach(async (bookItem) => {
                    await db.Book.create({
                        id: bookItem.upc,
                        title: bookItem.bookTitle,
                        price: +bookItem.bookPrice, // nhớ convert sang số
                        available: +bookItem.available, // nhớ convert sang số
                        image: bookItem.imageUrl,
                        description: bookItem.bookDescription,
                        category_code: generateCode(entry[0]),
                    });
                });
            });

            resolve('OK');
        } catch (error) {
            reject(error);
        }
    });
