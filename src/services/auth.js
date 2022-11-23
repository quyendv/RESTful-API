/* eslint-disable no-async-promise-executor */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';

// nhớ return, bị lỗi 1 lần rồi đấy, nếu ghi { bcrypt ... k return nó k có password đâu }
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8)); // salt tuy y

export const register = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOrCreate({
                where: { email },
                defaults: {
                    email, // những field thuộc where có thể k cần viết vào cũng tự thêm
                    password: hashPassword(password),
                },
            });

            console.log(response);

            const token = response[1]
                ? jwt.sign(
                      { id: response[0].id, email: response[0].email, role_code: response[0].role_code },
                      process.env.JWT_SECRET,
                      { expiresIn: 3600 }, // expiresIn: ngày hết hạn, đơn vị đọc thêm trên docs, ở đây 5d là 5 ngày
                  )
                : null; // nếu created thành công mới có token, response[0] = User

            resolve({
                err: response[1] ? 0 : 1, // created false tức là tìm được, 0 tạo thành công
                mes: response[1] ? 'Register is successfully' : 'Email is used',
                token,
            });

            resolve({
                err: 0,
                mes: 'register service',
            });
            console.log('after resolve');
        } catch (error) {
            reject(error);
        }
    });

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { email },
                raw: true, // lấy obj thuần k phải instance
            });

            const isChecked = response && bcrypt.compareSync(password, response.password);
            const token = isChecked
                ? jwt.sign(
                      { id: response.id, email: response.email, role_code: response.role_code },
                      process.env.JWT_SECRET,
                      { expiresIn: 3600 },
                  )
                : null;

            resolve({
                err: token ? 0 : 1, // created false tức là tìm được, k tạo thành công
                // eslint-disable-next-line no-nested-ternary
                mes: token ? 'Login is successfully' : response ? 'Password is wrong' : 'Email is not registered',
                access_token: token ? `Bearer ${token}` : null, // hoặc : token vì lúc này là null luôn rồi
            });
        } catch (error) {
            reject(error);
        }
    });

/*
    Hàm findOrCreate: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate
// created nếu tìm được (theo where) sẽ là false (tức k tạo), ngược lại lúc đó các cột field trong default vào
// default (k có 's') sẽ tạo được 1 cột thôi, thêm 's' để được nhiều cột

const [user, created] = await User.findOrCreate({
    where: { username: 'sdepold' },
    defaults: {
        job: 'Technical Lead JavaScript'
    }
});
*/
