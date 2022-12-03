import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';
import db from '../models';

// READ
export const getBooks = ({ page, limit, order, name, available, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            const queries = { raw: true, nest: true }; // nest: true -> lấy dữ liệu từ nhiều bảng khác thì nó gom lại 1 obj cho mình, k phân rã ra
            const offset = !page || +page <= 1 ? 0 : +page - 1; // lấy dữ liệu từ offset trở xuống
            const fLimit = +limit || +process.env.LIMIT_BOOK; // (chú ý dấu + ở cả env) check limit nếu có thì lấy float còn k thì lấy trong .env

            // filter: biến queries chỉ là tắt cho mấy cái queries của hàn finder trên sequelize như offset, limit, order(là mảng), ...
            queries.offset = offset * fLimit; // kiểu phân trang, offset bằng 1 limit bằng 5 (5 book 1 trang) thì lấy từ vị trí thứ 1*5 = 5 trở đi (0, 1, 2, 3, 4 ở trang 1 rồi) -> xem thêm video
            queries.limit = fLimit;
            if (order) queries.order = [order]; // chú ý là mảng nhé, đọc thêm trên docs phần order và phần operator: https://youtu.be/AhDSNPry8uw?list=PLGcINiGdJE93CggoN9YBjSnDRV7Rbp3Qu&t=653, https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#the-basics
            if (name) query.title = { [Op.substring]: name }; // nhớ import, query ở đây là đk truy vấn truyền vào where
            if (available) query.available = { [Op.between]: available }; // available phải là dạng mảng 2 giá trị

            // findAndCountAll: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findandcountall
            // nhớ là có All: tức k có đk thì tìm hết records, còn có thì tìm theo điều kiện. Không có all thì buộc có điều kiện k sẽ lỗi -> code lại lỗi rồi
            const response = await db.Book.findAndCountAll({
                where: query,
                ...queries,
                attributes: {
                    exclude: ['category_code'], // bỏ cột có sẵn đi vì join với category có cột code rồi
                },
                include: [
                    {
                        model: db.Category,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'], // attributes: [cột muốn lấy] như user cũng được hoặc {exclude: [cột muốn loại]} -> nhớ đuôi ed + At
                        },
                        as: 'categoryData', // trùng trong as model book -> gom các cột khi join lại thành 1 object tên là asName
                    },
                ], // join thêm 1 bảng dùng {} cũng được còn nhiều phải [] -> luôn dùng [] cũng được
            });

            resolve({
                err: response ? 0 : 1,
                mes: response ? 'Get books successfully' : 'Cant find books',
                bookData: response,
            });
        } catch (error) {
            reject(error);
        }
    });

// CREATE
export const createNewBook = (body) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = db.Book.findOrCreate({
                where: {
                    title: body?.title, // k cần ?. cũng được thì phải
                },
                defaults: {
                    ...body,
                    id: generateId(),
                }, // default cho 1 cột, defaults cho nhiều cột
            });
            console.log(response);
            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Create successfully' : 'Create failed',
                // bookData: response, // k cần trả: https://youtu.be/9Umjq5J40sk?list=PLGcINiGdJE93CggoN9YBjSnDRV7Rbp3Qu&t=1349
            });
        } catch (error) {
            reject(error);
        }
    });
// UPDATE
// DELETE
