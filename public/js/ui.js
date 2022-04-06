document.addEventListener('DOMContentLoaded', () => {
    const menus = document.getElementById('side-menu');
    M.Sidenav.init(menus, { edge: 'right' });

    const forms = document.getElementById('side-form');
    M.Sidenav.init(forms, { edge: 'left' });
})

const renderUiRecipe = (data, id) => {
    const html = `
        <div class="recipe card-panel white row" data-id="${id}">
            <img src="/img/dish.png" alt="recipe thumb" />
            <div class="recipe-details">
            <div class="recipe-title">${data.name}</div>
            <div class="recipe-ingredients">${data.ingredients}</div>
            <div class="recipe-delete">
            <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
    `

    recipes.innerHTML += html
}

const removeUiRecipe = (recipeId) => {
    const recipe = document.querySelector(`.recipe[data-id=${recipeId}]`)
    recipe.remove()
}

