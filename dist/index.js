"use strict";
/**
 * @fileoverview Main application file with custom error handling
 * @module index
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const winston_1 = __importDefault(require("./config/winston"));
const baseError_1 = require("./errors/baseError");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Database connection
winston_1.default.info('Connecting to MongoDB');
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/church-app')
    .then(() => {
    winston_1.default.info('Connected to MongoDB');
})
    .catch((error) => {
    winston_1.default.error('MongoDB connection error', { error: error.message });
    process.exit(1);
});
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/api/contacts', contactRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    winston_1.default.error('Uncaught error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body
    });
    if (err instanceof baseError_1.BaseError) {
        res.status(err.statusCode).json(err.toJSON());
        return;
    }
    res.status(500).json({
        status: 'error',
        code: 500,
        message: 'An unexpected error occurred'
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    winston_1.default.info('Server started', { port: PORT });
    winston_1.default.info('API documentation available at http://localhost:%d/api-docs', PORT);
});
