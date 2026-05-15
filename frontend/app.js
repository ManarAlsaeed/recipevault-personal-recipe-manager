const API = 'http://localhost:3000/recipes';

async function loadRecipes() {
  const ingredient = document.getElementById('searchIngredient').value.trim();
  const category = document.getElementById('filterCategory').value;

  let url = API;
  const params = new URLSearchParams();
  if (ingredient) params.append('ingredient', ingredient);
  if (category) params.append('category', category);
  if ([...params].length) url += '?' + params.toString();

  const res = await fetch(url);
  const recipes = await res.json();
  renderRecipes(recipes);
}

function renderRecipes(recipes) {
  const grid = document.getElementById('recipeGrid');
  grid.innerHTML = '';

  if (!recipes.length) {
    grid.innerHTML = '<p style="color:#999">No recipes found.</p>';
    return;
  }

  recipes.forEach(r => {
    grid.innerHTML += `
      <div class="recipe-card">
        <h3>${r.title}</h3>
        ${r.category ? `<span class="badge">${r.category}</span>` : ''}
        <p>${r.description || ''}</p>
        <p>⏱ ${r.prep_time ?? '—'} min &nbsp;|&nbsp; 🍽 ${r.servings ?? '—'} servings</p>
        <div class="card-actions">
          <button class="edit-btn" onclick="editRecipe(${r.id})">Edit</button>
          <button class="delete-btn" onclick="deleteRecipe(${r.id})">Delete</button>
        </div>
      </div>`;
  });
}

function addIngredientRow(ing = {}) {
  const div = document.createElement('div');
  div.className = 'ingredient-row';
  div.innerHTML = `
    <input type="text" placeholder="Name *" value="${ing.name || ''}" class="ing-name" required />
    <input type="number" placeholder="Qty" value="${ing.quantity || ''}" class="ing-qty" min="0"/>
    <input type="text" placeholder="Unit" value="${ing.unit || ''}" class="ing-unit" />
    <button type="button" class="remove-ing" onclick="this.parentElement.remove()">✕</button>`;
  document.getElementById('ingredients-list').appendChild(div);
}

function getIngredients() {
  return [...document.querySelectorAll('.ingredient-row')].map(row => ({
    name: row.querySelector('.ing-name').value.trim(),
    quantity: parseFloat(row.querySelector('.ing-qty').value) || null,
    unit: row.querySelector('.ing-unit').value.trim(),
  }));
}

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('formError');
  errorEl.textContent = '';

  const id = document.getElementById('recipeId').value;
  const ingredients = getIngredients();

  for (const ing of ingredients) {
    if (!ing.name) { errorEl.textContent = 'Each ingredient must have a name.'; return; }
  }

  const body = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    prep_time: parseInt(document.getElementById('prep_time').value) || null,
    servings: parseInt(document.getElementById('servings').value) || null,
    category: document.getElementById('category').value,
    steps: document.getElementById('steps').value.trim(),
    ingredients,
  };

  const method = id ? 'PATCH' : 'POST';
  const url = id ? `${API}/${id}` : API;

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) { errorEl.textContent = data.error; return; }

  resetForm();
  loadRecipes();
});

async function editRecipe(id) {
  const res = await fetch(`${API}/${id}`);
  const r = await res.json();

  document.getElementById('recipeId').value = r.id;
  document.getElementById('title').value = r.title;
  document.getElementById('description').value = r.description || '';
  document.getElementById('prep_time').value = r.prep_time || '';
  document.getElementById('servings').value = r.servings || '';
  document.getElementById('category').value = r.category || '';
  document.getElementById('steps').value = r.steps || '';

  document.getElementById('ingredients-list').innerHTML = '';
  (r.ingredients || []).forEach(ing => addIngredientRow(ing));

  document.getElementById('form-title').textContent = 'Edit Recipe';
  document.getElementById('cancelBtn').style.display = 'inline-block';
  window.scrollTo(0, 0);
}

async function deleteRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadRecipes();
}

function resetForm() {
  document.getElementById('recipeForm').reset();
  document.getElementById('recipeId').value = '';
  document.getElementById('ingredients-list').innerHTML = '';
  document.getElementById('form-title').textContent = 'Add New Recipe';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('formError').textContent = '';
}

// Load on start
loadRecipes();