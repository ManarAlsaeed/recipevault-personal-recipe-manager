const db = require('./db');

const RecipeModel = {
  getAll: ({ category, ingredient } = {}) => {
    if (ingredient) {
      return db.prepare(`
        SELECT DISTINCT r.* FROM recipes r
        JOIN ingredients i ON i.recipe_id = r.id
        WHERE LOWER(i.name) LIKE LOWER(?)
      `).all(`%${ingredient}%`);
    }
    if (category) {
      return db.prepare(`SELECT * FROM recipes WHERE LOWER(category) = LOWER(?)`).all(category);
    }
    return db.prepare(`SELECT * FROM recipes`).all();
  },

  getById: (id) => db.prepare(`SELECT * FROM recipes WHERE id = ?`).get(id),

  getIngredients: (recipe_id) =>
    db.prepare(`SELECT * FROM ingredients WHERE recipe_id = ?`).all(recipe_id),

  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO recipes (title, description, prep_time, servings, category, steps)
      VALUES (@title, @description, @prep_time, @servings, @category, @steps)
    `);
    const result = stmt.run(data);
    return result.lastInsertRowid;
  },

  addIngredient: (ingredient) => {
    db.prepare(`
      INSERT INTO ingredients (recipe_id, name, quantity, unit)
      VALUES (@recipe_id, @name, @quantity, @unit)
    `).run(ingredient);
  },

  update: (id, data) => {
    db.prepare(`
      UPDATE recipes SET
        title = @title,
        description = @description,
        prep_time = @prep_time,
        servings = @servings,
        category = @category,
        steps = @steps
      WHERE id = @id
    `).run({ ...data, id });
  },

  deleteIngredients: (recipe_id) =>
    db.prepare(`DELETE FROM ingredients WHERE recipe_id = ?`).run(recipe_id),

  delete: (id) => db.prepare(`DELETE FROM recipes WHERE id = ?`).run(id),
};

module.exports = RecipeModel;