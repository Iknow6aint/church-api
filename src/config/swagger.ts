/**
 * @fileoverview Swagger configuration for API documentation
 * @module config/swagger
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Church Management API',
      version: '1.0.0',
      description: 'API documentation for Church Management System',
      contact: {
        name: 'API Support',
        email: 'support@churchapp.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const specs = swaggerJsdoc(options);
