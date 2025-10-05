const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers['x-access-token'];
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    // Expect "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid or expired token' });
        req.user = decoded; // contains id, name, email, roleId
        next();
    });
};
