const RecipeService = require('../services/recipeService');

const RecipeController = {
  getAll: (req, res) => {
    const { category, ingredient } = req.query;
    const recipes = RecipeService.getAllRecipes({ category, ingredient });
    res.json(recipes);
  },

  getById: (req, res) => {
    const recipe = RecipeService.getRecipeById(Number(req.params.id));
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  },

  create: (req, res) => {
    try {
      const recipe = RecipeService.createRecipe(req.body);
      res.status(201).json(recipe);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: (req, res) => {
    try {
      const recipe = RecipeService.updateRecipe(Number(req.params.id), req.body);
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
      res.json(recipe);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: (req, res) => {
    const deleted = RecipeService.deleteRecipe(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Recipe not found' });
    res.status(204).send();
  },
};

module.exports = RecipeController;