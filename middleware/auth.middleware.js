const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_kee'; 

const authMiddleware = (req, res, next) => {
    console.log(req.headers);
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token.split('Bearer ')[1], SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded.username;
        next();
    });
};

module.exports = authMiddleware;
