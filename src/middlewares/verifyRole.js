/* eslint-disable camelcase */
import { notAuth } from './handleErrors';

export const isAdmin = (req, res, next) => {
    const { role_code } = req.user; // middleware verifyToken set key user cho req, vậy nên middleware này phải để sau
    if (role_code !== 'R1') return notAuth('Required role Admin', res);
    next();
};

export const isCreatorOrAdmin = (req, res, next) => {
    const { role_code } = req.user; // middleware verifyToken set key user cho req, vậy nên middleware này phải để sau
    if (role_code !== 'R1' && role_code !== 'R2') return notAuth('Required role Admin or Creator', res);
    next();
};
