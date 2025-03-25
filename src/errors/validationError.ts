/**
 * @fileoverview Validation-related errors
 * @module errors/validationError
 */

import { BaseError } from './baseError';

export class ValidationError extends BaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, true, details);
  }
}

export class RequiredFieldError extends ValidationError {
  constructor(field: string) {
    super(`${field} is required`, { field });
  }
}

export class InvalidFormatError extends ValidationError {
  constructor(field: string, format: string) {
    super(`Invalid format for ${field}. Expected: ${format}`, { field, format });
  }
}

export class InvalidDateRangeError extends ValidationError {
  constructor() {
    super('End date must be after start date', {
      start_date: 'Start date',
      end_date: 'End date'
    });
  }
}

export class InvalidGenderError extends ValidationError {
  constructor() {
    super('Invalid gender. Must be either "male" or "female"', {
      valid_values: ['male', 'female']
    });
  }
}
