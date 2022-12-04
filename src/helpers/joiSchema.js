import joi from 'joi';

// user rules
export const email = joi
    .string()
    // .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
    .pattern(new RegExp('gmail.com$')) // check pattern thêm sau: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript, https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/
    .required(); // docs: https://joi.dev/api/?v=17.7.0#stringemailoptions

export const password = joi
    .string()
    // .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')) // 6 đến 30 kí tự,
    .min(6)
    .required(); // nhớ required cho những cái bắt buộc

// book rules
export const title = joi.string().required();
export const price = joi.number().required();
export const available = joi.number().required();
export const category_code = joi.string().uppercase().alphanum().required(); // alphanum k chua space
export const image = joi.string().required(); // cái này phải sửa thành url nhưng mà để tạm string, chưa biết required url như nào
export const bid = joi.string().required(); // bid: bookID
export const bids = joi.array().required(); // bid array
// export const name = joi.string(); // V15: k cần thiết cho delete, nhưng ý là thêm param đó vào thì k báo lỗi not allowed
export const filename = joi.array().required();
