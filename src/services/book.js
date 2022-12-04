import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';
import db from '../models';

const cloudinary = require('cloudinary').v2;

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
export const createNewBook = (body, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.findOrCreate({
                // nhớ await, k có thì nếu lỗi id hay gì nó log ra, nếu có await nó toàn internal error chả biết, nma phải có mới create successfully được, nếu k tạo được cũng trả về create failed
                where: {
                    title: body?.title, // k cần ?. cũng được thì phải
                },
                defaults: {
                    ...body,
                    id: generateId(),
                    image: fileData?.path, // override lại image, giá trị là path của cloudinary
                    filename: fileData?.filename,
                }, // default cho 1 cột, defaults cho nhiều cột
            });

            console.log(response);
            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Create successfully' : 'Create failed, may be book is already',
                // bookData: response, // k cần trả: https://youtu.be/9Umjq5J40sk?list=PLGcINiGdJE93CggoN9YBjSnDRV7Rbp3Qu&t=1349
            });
            // -> lợi dụng tính năng resolve vẫn chạy tiếp bên dưới được (chỉ trừ k resolve tiếp thôi) khác với return là dừng hàm, ta sẽ xử lý xóa ảnh up mới nếu tạo k thành công (khi input hợp lệ và sách đã tồn tại)
            if (fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename); // nếu có fileData (khi input đúng sẽ có) và khi response[1] là false (tồn tại rồi) sẽ xóa ảnh vừa up đi
        } catch (error) {
            reject(error);
        }
    });

// UPDATE
/**
 * Hàm update({sửa cái gì}, {đk sửa}) và response nó trả về mảng 1 phần tử có giá trị là số bản khi được update: 0, 1, 2, ... => check update được hay k thì check response[0] > 0 hay không
 * Hàm update chỉ sửa những thông tin thay đổi, nên dùng với put thì nó vẫn ngang patch: https://youtu.be/UMCp6HoeLV4?list=PLGcINiGdJE93CggoN9YBjSnDRV7Rbp3Qu&t=1005
 * fileData: middleware uploader sẽ trả về req.file (fileData mình gán) là undefined nếu k up lên, sau đó nếu up lên mà bid thiếu (lỗi input đầu vào với joi, nhưng mà k check quá nhiều field như createNewBook vì chỉ chỉ update những thông tin cần thay đổi thôi), nếu lỗi joi thì destroy ảnh vừa up đi, nếu k lỗi thì pass xuống service
 */
export const updateBook = ({ bid, ...restData }, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            if (fileData) restData.image = fileData.path; // hoặc làm như createNewBook bên trên, giải nó ra rồi thêm image = fileData?.path cũng được
            console.log(restData);
            const response = await db.Book.update(restData, {
                where: { id: bid }, // chú ý khi put nhập input (trong req.body) là bid: ... nhưng cột trong table là id nha
            });

            console.log(response); // mảng 1 phần tử chứa số lượng bản ghi được update
            resolve({
                err: response[0] > 0 ? 0 : 1,
                mes:
                    response[0] > 0
                        ? `Update ${response[0]} book(s) successfully`
                        : 'Cannot update book/ Book ID not found',
            });
            if (fileData && response[0] === 0) cloudinary.uploader.destroy(fileData.filename); // filename not fileName
        } catch (error) {
            reject(error);
        }
    });

// DELETE
/**
 * Hàm destroy nó trả về 1 số lượng bản ghi được xóa (khác update lầ mảng 1 phần tử), và nó mặc định xóa mềm, xóa hẳn cần force
 * Link hàm (phần restore ngay bên dưới phần đó nữa): https://sequelize.org/docs/v6/core-concepts/paranoid/#deleting
 * // Lưu ý controller truyền query thì service phải destructuring lấy bids, hoặc cotroller truyền thẳng req.query.bids thì chỗ này lấy được (bids)
 * params xóa có dạng { bids=[id1, id2, ...], filename=[filename1, filename2, ...] }
 */
export const deleteBook = ({ bids, filename }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.destroy({
                where: {
                    id: bids, // id thuộc 1 mảng vẫn truyền như vầy được mà k cần [Op.in] thì phải
                },
            });

            console.log(response); // 1 phần tử, k phải mảng 1 phần tử như update
            resolve({
                err: response > 0 ? 0 : 1,
                mes: response > 0 ? `Delete ${response} book(s) successfully` : 'Cannot delete book/ Book ID not found',
            });
            if (filename) cloudinary.api.delete_resources(filename); // nhận mảng [item1, item2, item3...]
        } catch (error) {
            reject(error);
        }
    });
