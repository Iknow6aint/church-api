"use strict";
/**
 * @fileoverview Validation-related errors
 * @module errors/validationError
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidGenderError = exports.InvalidDateRangeError = exports.InvalidFormatError = exports.RequiredFieldError = exports.ValidationError = void 0;
const baseError_1 = require("./baseError");
class ValidationError extends baseError_1.BaseError {
    constructor(message, details) {
        super(message, 400, true, details);
    }
}
exports.ValidationError = ValidationError;
class RequiredFieldError extends ValidationError {
    constructor(field) {
        super(`${field} is required`, { field });
    }
}
exports.RequiredFieldError = RequiredFieldError;
class InvalidFormatError extends ValidationError {
    constructor(field, format) {
        super(`Invalid format for ${field}. Expected: ${format}`, { field, format });
    }
}
exports.InvalidFormatError = InvalidFormatError;
class InvalidDateRangeError extends ValidationError {
    constructor() {
        super('End date must be after start date', {
            start_date: 'Start date',
            end_date: 'End date'
        });
    }
}
exports.InvalidDateRangeError = InvalidDateRangeError;
class InvalidGenderError extends ValidationError {
    constructor() {
        super('Invalid gender. Must be either "male" or "female"', {
            valid_values: ['male', 'female']
        });
    }
}
exports.InvalidGenderError = InvalidGenderError;
