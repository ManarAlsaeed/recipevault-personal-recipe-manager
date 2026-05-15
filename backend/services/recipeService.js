const RecipeModel = require('../models/recipeModel');

const RecipeService = {
  getAllRecipes: (filters) => {
    return RecipeModel.getAll(filters);
  },

  getRecipeById: (id) => {
    const recipe = RecipeModel.getById(id);
    if (!recipe) return null;
    const ingredients = RecipeModel.getIngredients(id);
    return { ...recipe, ingredients };
  },

  createRecipe: (data) => {
    const { title, description, prep_time, servings, category, steps, ingredients } = data;

    if (!title || title.trim() === '') {
      throw new Error('Title is required');
    }
    if (prep_time !== undefined && prep_time < 0) {
      throw new Error('prep_time must be a positive number');
    }

    const id = RecipeModel.create({ title, description, prep_time, servings, category, steps });

    if (Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        if (!ing.name) throw new Error('Each ingredient must have a name');
        RecipeModel.addIngredient({ recipe_id: id, ...ing });
      }
    }

    return RecipeService.getRecipeById(id);
  },

  updateRecipe: (id, data) => {
    const existing = RecipeModel.getById(id);
    if (!existing) return null;

    const updated = {
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      prep_time: data.prep_time ?? existing.prep_time,
      servings: data.servings ?? existing.servings,
      category: data.category ?? existing.category,
      steps: data.steps ?? existing.steps,
    };

    if (!updated.title || updated.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    RecipeModel.update(id, updated);

    if (Array.isArray(data.ingredients)) {
      RecipeModel.deleteIngredients(id);
      for (const ing of data.ingredients) {
        RecipeModel.addIngredient({ recipe_id: id, ...ing });
      }
    }

    return RecipeService.getRecipeById(id);
  },

  deleteRecipe: (id) => {
    const existing = RecipeModel.getById(id);
    if (!existing) return false;
    RecipeModel.delete(id);
    return true;
  },
};

module.exports = RecipeService;