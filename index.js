// lib and imports
const express = require("express");
const app = express();

const recipe = require("./controllers/recipe-controller")

// app setup
app.use(express.json())
app.use("/static", express.static("public"));
app.set("view engine", "ejs");


// pages
app.get('/',(req, res) => {
  // callback
  res.render('recipes.ejs');
});


// Create here your api setup
app.post('/api/addtodb', (req, res) => {
  console.log('Message from the brain: adding info to DB')
  recipe.addToDB(req.body, res)
})
app.post('/api/queryrecipes', (req, res) => {
  console.log('DB query sent')
  recipe.queryRecipes(req, res)
})
app.put('/api/updaterecipe', (req, res) => {
  console.log('Message from the brain: updating a recipe')
  recipe.updateRecipe(req.body, res)
})
app.delete('/api/removefromdb', (req, res) => {
  console.log('Message from the brain: removing recipe from the DB')
  recipe.removeFromDB(req.body, res)
})


app.listen(3000, () => console.log("Server Up and running"));