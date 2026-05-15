const RecipeService = require('../services/recipeService');

// Mock the model so tests don't touch real DB
jest.mock('../models/recipeModel', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  getIngredients: jest.fn(),
  create: jest.fn(),
  addIngredient: jest.fn(),
  update: jest.fn(),
  deleteIngredients: jest.fn(),
  delete: jest.fn(),
}));

const RecipeModel = require('../models/recipeModel');

describe('RecipeService', () => {

  beforeEach(() => jest.clearAllMocks());

  // --- createRecipe ---
  describe('createRecipe', () => {
    test('throws if title is missing', () => {
      expect(() => RecipeService.createRecipe({ description: 'No title' }))
        .toThrow('Title is required');
    });

    test('throws if title is empty string', () => {
      expect(() => RecipeService.createRecipe({ title: '   ' }))
        .toThrow('Title is required');
    });

    test('throws if prep_time is negative', () => {
      expect(() => RecipeService.createRecipe({ title: 'Test', prep_time: -5 }))
        .toThrow('prep_time must be a positive number');
    });

    test('creates recipe and returns it with ingredients', () => {
      RecipeModel.create.mockReturnValue(1);
      RecipeModel.getById.mockReturnValue({ id: 1, title: 'Pasta' });
      RecipeModel.getIngredients.mockReturnValue([{ name: 'Egg', quantity: 2, unit: 'pcs' }]);

      const result = RecipeService.createRecipe({
        title: 'Pasta',
        ingredients: [{ name: 'Egg', quantity: 2, unit: 'pcs' }],
      });

      expect(RecipeModel.create).toHaveBeenCalledTimes(1);
      expect(RecipeModel.addIngredient).toHaveBeenCalledTimes(1);
      expect(result.title).toBe('Pasta');
      expect(result.ingredients).toHaveLength(1);
    });
  });

  // --- getRecipeById ---
  describe('getRecipeById', () => {
    test('returns null if recipe not found', () => {
      RecipeModel.getById.mockReturnValue(null);
      expect(RecipeService.getRecipeById(99)).toBeNull();
    });

    test('returns recipe with ingredients', () => {
      RecipeModel.getById.mockReturnValue({ id: 1, title: 'Salad' });
      RecipeModel.getIngredients.mockReturnValue([{ name: 'Lettuce' }]);

      const result = RecipeService.getRecipeById(1);
      expect(result.title).toBe('Salad');
      expect(result.ingredients).toHaveLength(1);
    });
  });

  // --- updateRecipe ---
  describe('updateRecipe', () => {
    test('returns null if recipe does not exist', () => {
      RecipeModel.getById.mockReturnValue(null);
      expect(RecipeService.updateRecipe(99, { title: 'X' })).toBeNull();
    });

    test('throws if title is set to empty', () => {
      RecipeModel.getById.mockReturnValue({ id: 1, title: 'Old', description: '', prep_time: 10, servings: 2, category: 'Lunch', steps: '' });
      expect(() => RecipeService.updateRecipe(1, { title: '' }))
        .toThrow('Title cannot be empty');
    });
  });

  // --- deleteRecipe ---
  describe('deleteRecipe', () => {
    test('returns false if recipe not found', () => {
      RecipeModel.getById.mockReturnValue(null);
      expect(RecipeService.deleteRecipe(99)).toBe(false);
    });

    test('deletes and returns true', () => {
      RecipeModel.getById.mockReturnValue({ id: 1, title: 'Soup' });
      expect(RecipeService.deleteRecipe(1)).toBe(true);
      expect(RecipeModel.delete).toHaveBeenCalledWith(1);
    });
  });

});