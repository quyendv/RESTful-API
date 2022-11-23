import joi from 'joi';

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
