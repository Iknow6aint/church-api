"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const authService_1 = require("../services/authService");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Invalid token format' });
            return;
        }
        const decoded = authService_1.authService.verifyToken(token);
        req.admin = decoded;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
            return;
        }
        res.status(401).json({ error: 'An unexpected error occurred' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
