"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.signup({
                name,
                email,
                password
            });
            res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.signin(email, password);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!req.admin?.adminId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const result = await this.authService.changePassword(req.admin.adminId, currentPassword, newPassword);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async introspect(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                res.status(400).json({ error: 'Token is required' });
                return;
            }
            const result = await this.authService.introspectToken(token);
            res.json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController(new authService_1.AuthService());
