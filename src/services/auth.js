/* eslint-disable camelcase */
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

            const accessToken = response[1]
                ? jwt.sign(
                      { id: response[0].id, email: response[0].email, role_code: response[0].role_code },
                      process.env.JWT_SECRET,
                      { expiresIn: '5s' }, // expiresIn: ngày hết hạn, đơn vị đọc thêm trên docs
                  )
                : null; // nếu created thành công mới có accessToken, response[0] = User

            // JWT_SECRET_REFRESH_TOKEN
            const refreshToken = response[1]
                ? jwt.sign({ id: response[0].id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' })
                : null;

            resolve({
                err: response[1] ? 0 : 1, // created false tức là tìm được, 0 tạo thành công
                mes: response[1] ? 'Register is successfully' : 'Email is used',
                access_token: accessToken ? `Bearer ${accessToken}` : null, // hoặc : accessToken vì lúc này là null luôn rồi
                refresh_token: refreshToken,
            });

            if (refreshToken) {
                await db.User.update(
                    { refresh_token: refreshToken },
                    {
                        where: {
                            id: response[0].id,
                        },
                    },
                );
            }
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
            const accessToken = isChecked
                ? jwt.sign(
                      { id: response.id, email: response.email, role_code: response.role_code },
                      process.env.JWT_SECRET,
                      { expiresIn: '5s' },
                  )
                : null;

            // JWT_SECRET_REFRESH_TOKEN: chú ý copy đoạn này từ register thì sửa k có response[0/1] đâu nhé, và phải theo isChecked nhé, login vào đúng mới được
            const refreshToken = isChecked
                ? jwt.sign({ id: response.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' }) // 15d, test refreshToken nên dùng thử 60s
                : null;

            resolve({
                err: accessToken ? 0 : 1, // created false tức là tìm được, k tạo thành công
                // eslint-disable-next-line no-nested-ternary
                mes: accessToken ? 'Login is successfully' : response ? 'Password is wrong' : 'Email is not registered',
                access_token: accessToken ? `Bearer ${accessToken}` : null, // hoặc : accessToken vì lúc này là null luôn rồi
                refresh_token: refreshToken,
            });

            if (refreshToken) {
                await db.User.update(
                    { refresh_token: refreshToken },
                    {
                        where: {
                            id: response.id,
                        },
                    },
                );
            }
        } catch (error) {
            reject(error);
        }
    });

/**
 * Bên controller nếu truyền req.body rồi bên service dùng destructuring thì buộc phải đúng key refreshToken, còn nếu truyền .body.refreshToken thì bên kia đặt tên gì cũng đc vì nó là biến của hàm
 * Nên truyền .body.refreshToken đỡ trùng tên bên service, mà đặt trùng chỗ đấy cũng k sao thì phải vì nó tên biến fn khác destructuring như joi rule
 * -> tóm lại chỗ này dùng tên tham số của fn chứ k phải destructuring nên đặt .._token hay ..Token đều dược
 *
 * Ý nghĩa hàm này: Xem kĩ trong note
 *  -> Khi yêu cầu lấy data mà cần xác thực thì gửi jwt qua, nếu token hết hạn thì server gửi tb về accessToken hết hạn. Client sẽ TỰ ĐỘNG gửi api khác với refreshToken để server check xem cái refreshToken trước đó đã lưu (thường là db) có còn hạn k. Nếu RToken còn hạn thì tạo AToken mới và gửi newAT kèm RT lại cho Client, nếu RT hết hạn (lâu quá k vào app) thì yêu cầu đăng nhập lại
 */
export const refreshToken = (refresh_token) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: {
                    refresh_token,
                },
            });

            if (response) {
                jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err, decode) => {
                    if (err) {
                        // Lỗi RToken hết hạn: Vì đã check có response rồi nên chỗ này chỉ có lỗi hết hạn khi decode, chứ chắc chắn tìm được user có refresh_token như đối số truyền vào rồi => lâu k vào app, đến RToken cũng hết hạn thì cần đăng nhập lại
                        resolve({
                            err: 1,
                            mes: 'Refresh token expired. Require login',
                            error: err,
                        });
                    } else {
                        // Khi RT còn hạn (nhưng AT hết hạn, vì api này tự động gửi khi AT hết hạn) sẽ tạo mới AT
                        const accessToken = jwt.sign(
                            { id: response.id, email: response.email, role_code: response.role_code },
                            process.env.JWT_SECRET,
                            { expiresIn: '60s' },
                        );
                        resolve({
                            err: accessToken ? 0 : 1, // 1 err là err tạo k thành công AT mới
                            mes: accessToken ? 'OK' : 'Fail to generate new access token. Let try more time',
                            access_token: accessToken ? `Bearer ${accessToken}` : null,
                            refresh_token,
                        });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }
    });
