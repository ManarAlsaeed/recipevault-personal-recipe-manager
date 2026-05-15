const swaggerUi = require('swagger-ui-express');

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'RecipeVault API',
    version: '1.0.0',
    description: 'Personal Recipe Manager API',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/recipes': {
      get: {
        summary: 'Get all recipes',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, example: 'Vegan' },
          { name: 'ingredient', in: 'query', schema: { type: 'string' }, example: 'chicken' },
        ],
        responses: { 200: { description: 'List of recipes' } },
      },
      post: {
        summary: 'Create a recipe',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecipeInput' },
            },
          },
        },
        responses: {
          201: { description: 'Recipe created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/recipes/{id}': {
      get: {
        summary: 'Get recipe by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Recipe found' },
          404: { description: 'Recipe not found' },
        },
      },
      patch: {
        summary: 'Update a recipe',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecipeInput' },
            },
          },
        },
        responses: {
          200: { description: 'Recipe updated' },
          404: { description: 'Recipe not found' },
        },
      },
      delete: {
        summary: 'Delete a recipe',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Deleted successfully' },
          404: { description: 'Recipe not found' },
        },
      },
    },
  },
  components: {
    schemas: {
      RecipeInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Pasta Carbonara' },
          description: { type: 'string', example: 'Classic Italian pasta' },
          prep_time: { type: 'integer', example: 30 },
          servings: { type: 'integer', example: 4 },
          category: { type: 'string', example: 'Dinner' },
          steps: { type: 'string', example: '1. Boil pasta...' },
          ingredients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Pasta' },
                quantity: { type: 'number', example: 200 },
                unit: { type: 'string', example: 'g' },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = { swaggerUi, swaggerDoc };