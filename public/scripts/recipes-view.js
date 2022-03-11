// FRONT END FILE TO INTERACT WITH THE DOM

const searchInput = document.querySelector('#search-recipes-input')
const searchBtn = document.querySelector('.search-recipes-button')
const showRecipesBtn = document.querySelector('.show-recipes-button')
const recipesContainer = document.querySelector('.recipes-container')

// Create a modal
const createModal = (modalContent) => {
    const body = document.querySelector('body')
    const modal = document.createElement('div')
    modal.ariaModal = 'true'
    modal.classList.add('modal-container')
    
    const modalBox = document.createElement('div')
    modalBox.classList.add('modal')
    const modalCloseBtn = document.createElement('button')
    modalCloseBtn.classList.add('modal-close-btn')
    modalCloseBtn.textContent = '×'

    modalBox.append(modalCloseBtn, modalContent)
    modal.append(modalBox)
    body.append(modal)

    body.style.overflow = 'hidden'

    // Events
    modalCloseBtn.addEventListener('click', (e) => {
        modal.remove()
        body.style.overflow = 'initial'
    })
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.remove()
            body.style.overflow = 'initial'    
        }
    })
}

// Create a modal to update a recipe
const openRecipeUpdater = (recipe) => {
    const modalContentContainer = document.createElement('div')

    const ingredientsList = recipe.ingredients.map((ingredient, k) => {
        return `
        <div>
            <label for="modify-ingredient${k}">Ingredient ${k}</label>
            <input type="text" name="modify-ingredient${k}" id="modify-ingredient${k}" class="modify-input" value="${ingredient[0]}">
        </div>
        <div>
            <label for="modify-measure${k}">Measure ${k}</label>
            <input type="text" name="modify-measure${k}" id="modify-measure${k}" class="modify-input" value="${ingredient[1]}">
        </div>`
    })

    const modalContent = `<h2>Update the recipe</h2>
        <form action="" class="form-modify-recipe">
            <label for="modify-name">Name</label>
            <input type="text" name="modify-name" id="modify-name" class="modify-input" value="${recipe.name}">

            <label for="modify-meal-thumb">Image</label>
            <input type="text" name="modify-meal-thumb" id="modify-meal-thumb" class="modify-input" value="${recipe.meal_thumb}">

            <label for="modify-area">Area</label>
            <input type="text" name="modify-area" id="modify-area" class="modify-input" value="${recipe.area}">

            <label for="modify-category">Category</label>
            <input type="text" name="modify-category" id="modify-category" class="modify-input" value="${recipe.category}">

            <div class="modify-ingredients-container">
            ${ingredientsList.join('\n\n')}
            </div>

            <label for="modify-instructions">Instructions</label>
            <textarea type="text" name="modify-instructions" id="modify-instructions" class="modify-textarea">${recipe.instructions}</textarea>

            <label for="modify-video">Youtube video</label>
            <input type="text" name="modify-video" id="modify-video" class="modify-input" value="${recipe.youtube_link}">

            <div>
                <input type="button" value="Update recipe" class="update-recipe-button btn-secondary">
                <p class="update-status"></p>
            </div>
        </form>`

    modalContentContainer.insertAdjacentHTML('afterbegin', modalContent)

    const updateRecipeBtn = modalContentContainer.querySelector('.update-recipe-button')
    const updateStatus = modalContentContainer.querySelector('.update-status')
    const modifyNameInput = modalContentContainer.querySelector('#modify-name')
    const modifyMealThumbInput = modalContentContainer.querySelector('#modify-meal-thumb')
    const modifyAreaInput = modalContentContainer.querySelector('#modify-area')
    const modifyCategoryInput = modalContentContainer.querySelector('#modify-category')
    const modifyInstructionsInput = modalContentContainer.querySelector('#modify-instructions')
    const modifyVideoInput = modalContentContainer.querySelector('#modify-video')

    createModal(modalContentContainer)

    // Events
    updateRecipeBtn.addEventListener('click', (e) => {
        const newRecipe = {
            id: recipe.id,
            name: modifyNameInput.value,
            meal_thumb: modifyMealThumbInput.value,
            area: modifyAreaInput.value,
            category: modifyCategoryInput.value,
            instructions: modifyInstructionsInput.value,
            youtube_link: modifyVideoInput.value,
        }
        
        updateRecipe(newRecipe)
        updateExistingCard(recipe.id, newRecipe)

        updateStatus.style.animation = 'fadeOut 3s ease-in 0s 1 normal forwards running'
        updateStatus.textContent = 'Recipe updated ✓'
        setTimeout(()=> {
            updateStatus.textContent = ''
            updateStatus.style.animation = ''
        }, 3000)
    })
}

// After updating the DB, update the cards displayed on screen
const updateExistingCard = (recipeID, newRecipeData) => {
    const card = document.querySelector(`.recipe-card[data-recipe-id="${recipeID}"]`)

    const recipeTitle = card.querySelector('h2')
    const recipeImg = card.querySelector('.recipe-img')
    const recipeArea = card.querySelector('.tag[title="Type of cuisine"]')
    const recipeCategory = card.querySelector('.tag[title="Category"]')
    const recipeInstructions = card.querySelector('.recipe-instructions')
    const recipeVideo = card.querySelector('.recipe-video') ? card.querySelector('.recipe-video') : {}

    recipeTitle.textContent = newRecipeData.name
    recipeImg.src = newRecipeData.meal_thumb
    recipeImg.alt = newRecipeData.name
    recipeArea.textContent = newRecipeData.area
    recipeCategory.textContent = newRecipeData.category
    recipeInstructions.innerText = newRecipeData.instructions
    recipeVideo.src = newRecipeData.youtube_link.replace('watch?v=', 'embed/')
}

// Create a card in the DOM
const createRecipeCardFromApi = (data, recipesContainer) => {
    const recipe = data

    // Create DOM elements
    const newCard = document.createElement('article')
    newCard.classList.add('recipe-card')

    // Get an easier grasp on ingredients and their measures
    const { strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15, strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20 } = recipe
    const { strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15, strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20 } = recipe

    const ingredientList = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15, strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20]
    const measureList = [strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15, strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20]

    // Create an array of <li> with .map() of the number of existing ingredients (by filtering undefined elements)
    const ingredientListItems = ingredientList.map((ingredient, k) => {
        if (ingredient) {
            return `<li class="ingredient-item">${ingredient} <span class="ingredient-measure">(${measureList[k]})</span></li>`
        }
    }).filter((ingredient) => {
        return ingredient !== undefined
    })

    newCard.insertAdjacentHTML('afterbegin', `
        <div class="db-btns-container">
            <button class="add-to-db-btn btn-primary">Add to DB</button>
        </div>
        <img class="recipe-img" src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h2>${recipe.strMeal}</h2>
        <div class="tags">
            ${recipe.strArea === 'Unknown' ? '' : '<div class="tag" title="Type of cuisine">' + recipe.strArea + '</div>'}
            <div class="tag" title="Category">${recipe.strCategory}</div>
        </div>

        <details class="recipe-see-more">
            <summary>See more</summary>

            <div class="ingredients-list-container">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                    ${ingredientListItems.join('\n')}
                </ul>
            </div>

            <div class="recipe-instructions-container">
                <h3>Recipe</h3>
                <p class="recipe-instructions"></p>
            </div>

            <!-- <iframe class="recipe-video" src="${recipe.strYoutube.replace("watch?v=", "embed/")}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
        </details>
    `)
    
    // To make sure that returns ('\n') are taken into account
    const recipeInstructions = newCard.querySelector('.recipe-instructions')
    recipeInstructions.innerText = recipe.strInstructions

    const addToDbBtn = newCard.querySelector('.add-to-db-btn')
    addToDbBtn.addEventListener('click', (e) => {
        addToDB({recipe})
    })

    recipesContainer.append(newCard)
}

// Create a card in the DOM
const createRecipeCardFromDB = (data, recipesContainer) => {
    const recipe = data

    // Create DOM elements
    const newCard = document.createElement('article')
    newCard.classList.add('recipe-card')
    newCard.dataset.recipeId = recipe.id

    // Create an array of <li> with .map() of the number of existing ingredients (by filtering undefined elements)
    const ingredientListItems = recipe.ingredients.map(ingredient => {
        return `<li class="ingredient-item">${ingredient[0]} <span class="ingredient-measure">(${ingredient[1]})</span></li>`
    })

    newCard.insertAdjacentHTML('afterbegin', `
        <div class="db-btns-container">
            <button class="update-db-btn">Update recipe</button>
            <button class="remove-from-db-btn">Remove from DB</button>
        </div>
        <img class="recipe-img" src="${recipe.meal_thumb}" alt="${recipe.name}">
        <h2>${recipe.name}</h2>
        <div class="tags">
            <div class="tag" title="Type of cuisine">${recipe.area}</div>
            <div class="tag" title="Category">${recipe.category}</div>
        </div>

        <details class="recipe-see-more">
            <summary>See more</summary>

            <div class="ingredients-list-container">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                    ${ingredientListItems.join('\n')}
                </ul>
            </div>

            <div class="recipe-instructions-container">
                <h3>Recipe</h3>
                <p class="recipe-instructions"></p>
            </div>

            <!-- <iframe class="recipe-video" src="${recipe.youtube_link.replace("watch?v=", "embed/")}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
        </details>
    `)
    
    // To make sure that returns ('\n') are taken into account
    const recipeInstructions = newCard.querySelector('.recipe-instructions')
    recipeInstructions.innerText = recipe.instructions

    const removeFromDbBtn = newCard.querySelector('.remove-from-db-btn')
    const updateDbBtn = newCard.querySelector('.update-db-btn')

    removeFromDbBtn.addEventListener('click', () => {
        const modalContentContainer = document.createElement('div')
        const modalContent = `<p>Are you sure you want to delete the ${recipe.name}?</p>
        <button class="deletion-confirmed btn-secondary">Yes</button>
        <button class="deletion-refused btn-primary">No</button>`

        modalContentContainer.insertAdjacentHTML('afterbegin', modalContent)
        createModal(modalContentContainer)
        
        const acceptDeleteBtn = modalContentContainer.querySelector('.deletion-confirmed')
        const refuseDeleteBtn = modalContentContainer.querySelector('.deletion-refused')
        acceptDeleteBtn.addEventListener('click', () => {
            removeFromDB({recipe})
            modalContentContainer.parentElement.parentElement.remove()
            document.querySelector('body').style.overflow = 'visible'
        })
        refuseDeleteBtn.addEventListener('click', () => {
            modalContentContainer.parentElement.parentElement.remove()
            document.querySelector('body').style.overflow = 'visible'
        })
    })
    updateDbBtn.addEventListener('click', () => openRecipeUpdater(recipe))

    recipesContainer.append(newCard)
}

// API FETCH MealDB
const fetchRecipeData = (searchStr, container) => {
    container.innerHTML = ''

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchStr}`)
    .then(response => response.json())
    .then(data => {
        data.meals.forEach(meal => {
            createRecipeCardFromApi(meal, container)
        })
    })
}

// Add a recipe to the DB
const addToDB = (infos) => {
    fetch('api/addtodb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(infos)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err))
}

// Read recipes
const queryRecipesFromDB = () => {
    fetch('api/queryrecipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',    
        }
    })
    .then(response => response.json())
    .then(data => {
        recipesContainer.innerHTML = ''
        data.recipes.forEach(recipe => {
            createRecipeCardFromDB(recipe, recipesContainer)
        })
        // console.log('Success:', data)
    })
    .catch(err => console.error('Error:', err))
}

// Update a recipe
const updateRecipe = (infos) => {
    fetch('api/updaterecipe', {
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(infos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data)
    })
    .catch(err => console.error('Error:', err))
}

// Remove a recipe from the DB
const removeFromDB = (infos) => {
    fetch('api/removefromdb', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(infos)
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector(`.recipe-card[data-recipe-id="${data.id}"]`).remove()
        // console.log('Success:', data)

    })
    .catch(err => console.error('Error:', err))
}

// ENTRY POINTS
searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    fetchRecipeData(searchInput.value, recipesContainer)
})

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        fetchRecipeData(searchInput.value, recipesContainer)
    }
})

showRecipesBtn.addEventListener('click', (e) => {
    queryRecipesFromDB()
})