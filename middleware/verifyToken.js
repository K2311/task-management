const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Token is not valid' });
    }
}

module.exports = verifyToken;