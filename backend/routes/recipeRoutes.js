const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');

router.get('/', RecipeController.getAll);
router.get('/:id', RecipeController.getById);
router.post('/', RecipeController.create);
router.patch('/:id', RecipeController.update);
router.delete('/:id', RecipeController.delete);

module.exports = router;