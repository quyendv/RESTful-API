/* eslint-disable no-async-promise-executor */
import db from '../models';

export const getOne = (userId) =>
    new Promise(async (resolve, reject) => {
        try {
            // Có thể dùng findByPk cho nhanh
            const response = await db.User.findOne({
                where: { id: userId }, // id là column trong db, hoặc dùng email cũng được vì nó unique
                attributes: {
                    exclude: ['password', 'role_code'], // sẽ lấy record (bản ghi) của user ra theo id nhưng k trả về column password làm gì: https://youtu.be/SSCHzHaTnqQ?list=PLGcINiGdJE93CggoN9YBjSnDRV7Rbp3Qu&t=1676
                },
                include: [
                    {
                        model: db.Role,
                        as: 'roleData', // trùng với as trong models/user
                        attributes: ['id', 'code', 'value'], // attributes có thể là array/object với include/exclude: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#specifying-attributes-for-select-queries
                    },
                ],
            });

            resolve({
                err: response ? 0 : 1,
                mes: response ? 'Get user successfully' : 'User not found',
                userData: response,
            });
        } catch (error) {
            reject(error);
        }
    });
