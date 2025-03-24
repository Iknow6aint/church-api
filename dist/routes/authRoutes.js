"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/signup', authController_1.authController.signup);
router.post('/signin', authController_1.authController.signin);
// Protected routes
router.put('/change-password', auth_1.authenticateToken, authController_1.authController.changePassword);
router.post('/introspect', auth_1.authenticateToken, authController_1.authController.introspect);
exports.default = router;
