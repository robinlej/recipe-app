const sqlite3 = require('sqlite3').verbose()
const RECIPES_DB = 'db/db.recipes'

// BACKEND FILE FOR MY DATABASES QUERIES

// ============== CREATE ===============
// Add a recipe to the DB
const addToDB = (req, res) => {
    console.log(req)
    
    const db = new sqlite3.Database(RECIPES_DB)
    
    db.serialize(() => {
        addRecipeToDB(req.recipe, db)
        addIngredientsToDB(req.recipe, db)
        addIngredientsPerRecipeToDB(req.recipe, db)
    })
    
    db.close((err) => {
        if (err) {
          res.status(500).send({status: err.message})
        }
        res.status(200).send({status: 'Recipe inserted'})
      })  
}

const addRecipeToDB = (recipe, db) => {
    const { strMeal, strCategory, strArea, strInstructions, idMeal, strMealThumb, strYoutube } = recipe
    console.log(strMeal)

    db.run(`INSERT INTO recipes (name, category, area, instructions, meal_id, meal_thumb, youtube_link) VALUES (?, ?, ?, ?, ?, ?, ?)`, [strMeal, strCategory, strArea, strInstructions, idMeal, strMealThumb, strYoutube], function(err) {
      if (err) {
        return console.log(err);
      }
      // get the last insert id
    //   console.log(`A row has been inserted with rowid ${this.lastID}`);
    })
}

const addIngredientsToDB = (recipe, db) => {
    const { strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15, strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20 } = recipe

    const ingredientList = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15, strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20]

    ingredientList.forEach(ingredient => {
        if (ingredient) {
            db.run(`INSERT INTO ingredients (name) VALUES (?)`, [ingredient], function(err) {
              if (err) {
                return console.log(err);
              }
              // get the last insert id
            //   console.log(`A row has been inserted with rowid ${this.lastID}`);
            })
        }
    })
}


const addIngredientsPerRecipeToDB = (recipe, db) => {
    const recipeName = recipe.strMeal

    const { strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15, strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20 } = recipe

    const ingredientList = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15, strIngredient16, strIngredient17, strIngredient18, strIngredient19, strIngredient20]

    const { strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15, strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20 } = recipe

    const measureList = [strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15, strMeasure16, strMeasure17, strMeasure18, strMeasure19, strMeasure20]
    
    measureList.forEach((measure, k) => {
        if (measure) {
            db.run(`INSERT INTO ingredients_per_recipe (recipe_id, ingredient_id, measure) 
                VALUES (
                    (SELECT id FROM recipes WHERE name=?), 
                    (SELECT id FROM ingredients WHERE name=?), 
                    ?
                )`,
                [recipeName, ingredientList[k], measure], function(err) {
                if (err) {
                  return console.log(err);
                }
                // get the last insert id
              //   console.log(`A row has been inserted with rowid ${this.lastID}`);
            })
        }
    })
}

// ============== READ ===============

const queryRecipes = (req, res) => {
    let sendData = []
    
    const db = new sqlite3.Database(RECIPES_DB, (err) => {
        if (err) console.error(err.message)
    })
    
    db.serialize(() => {
      let couplesIDIndex = []
      let currentRowIndex

      db.each(`SELECT * FROM recipes`, (err, row) => {
        if (err) console.error(err.message)
        row.ingredients = []
        sendData.push(row)
      })
      .each(`SELECT i.name, ipr.measure, r.id FROM ingredients AS i 
        INNER JOIN ingredients_per_recipe AS ipr, recipes AS r
        ON i.id = ipr.ingredient_id AND ipr.recipe_id = r.id
        WHERE EXISTS
          (SELECT recipe_id
          FROM ingredients_per_recipe ipr
          JOIN ingredients i ON ipr.ingredient_id = i.id
          WHERE ipr.recipe_id = r.id)`, function(err, row) {
        if (err) return console.log(err)
        
        // Get the index so as to push in sendData at the correct index
        const recipeIDAlreadyExists = couplesIDIndex.find(recipe => recipe.id === row.id)
        if (recipeIDAlreadyExists) {
          currentRowIndex = recipeIDAlreadyExists.index
        }
        else {
          currentRowIndex = couplesIDIndex.length
          couplesIDIndex.push({id: row.id, index: currentRowIndex})
        }

        let addedIngredient = [ row.name, row.measure ]
        sendData[currentRowIndex].ingredients = [...sendData[currentRowIndex].ingredients, addedIngredient]
      })
    })
    
    db.close((err) => {
        if (err) {
          res.status(500).send({status: err.message})
        }
        res.status(200).send({recipes: sendData})
      })  
}

// ============== UPDATE ===============
// Update the elements from one recipe
const updateRecipe = (req, res) => {
  const recipe = req
  
  const db = new sqlite3.Database(RECIPES_DB)
  
  db.run(`UPDATE recipes
    SET name = ?,
    meal_thumb = ?,
    area = ?,
    category = ?,
    instructions = ?,
    youtube_link = ?
    WHERE id = ?`, [recipe.name, recipe.meal_thumb, recipe.area, recipe.category, recipe.instructions, recipe.youtube_link, recipe.id], function(err) {
    if (err) return console.log(err)
  })
 
  db.close((err) => {
      if (err) {
        res.status(500).send({status: err.message})
      }
      res.status(200).send({status: 'Recipe updated', id: recipe.id})
    })  

}

// ============== DELETE ===============
// Remove a recipe from the DB
const removeFromDB = (req, res) => {
  const recipe = req.recipe
  
  const db = new sqlite3.Database(RECIPES_DB)
  
  db.serialize(() => {
    db.run(`DELETE FROM recipes WHERE id=?`, [recipe.id], function(err) {
      if (err) return console.log(err)
    })
    db.run(`DELETE FROM ingredients_per_recipe WHERE recipe_id=?`, [recipe.id], function(err) {
      if (err) return console.log(err)
    })
  })
  
  db.close((err) => {
      if (err) {
        res.status(500).send({status: err.message})
      }
      res.status(200).send({status: 'Recipe deleted', id: recipe.id})
    })  
}


// ============== EXPORTS ===============
exports.addToDB = addToDB
exports.queryRecipes = queryRecipes
exports.updateRecipe = updateRecipe
exports.removeFromDB = removeFromDB