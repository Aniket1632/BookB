import expressJWT from 'express-jwt';
import constant from './index.js'


const getTokenFromHeaders = (req) => {
    const authorization = req.headers.token;
    if (authorization && authorization !== '') {
        return authorization;
    }
    return null;
};

const auth = {
    required: expressJWT({
        secret: constant.JWT_SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
    optional: expressJWT({
        secret: constant.JWT_SECRET,
        algorithms: ['HS256'],
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
    admin: (req, res, next) => {
        if (req.payload && req.payload.role === 'admin') {
            next()
        } else {
            res.status(401).json({ status: false, message: 'Unauthorized user' })
        }
    }

};

export default auth;