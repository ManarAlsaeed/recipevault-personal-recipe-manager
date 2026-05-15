const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');
const { swaggerUi, swaggerDoc } = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/recipes', recipeRoutes);

module.exports = app;