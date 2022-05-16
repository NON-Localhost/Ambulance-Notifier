const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, proces.env.JWT_SERCRET_KEY);
    }
    catch(err){
        console.log(err);
        err.status = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated');
        error.status = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}