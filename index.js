require('dotenv').config()

const cors = require('cors')
const mongoString = process.env.DATABASE_URL
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const localPort = 3001

mongoose.connect(mongoString) 
const database = mongoose.connection
const choreTrackerRouter = require('./routes/ChoreTracker/choreTracker.route')
const petsRouter = require('./routes/Pets/pets')
const feederRouter = require('./routes/Feeder/feeder')
const shoppingListRouter = require('./routes/ShoppingList/shoppingList.route')
const recipeRouter = require('./routes/Recipe/recipe.route');
const mealPlannerRouter = require('./routes/MealPlanner/mealplanner.route');

database.on('error', (error) => {
    console.log('DB Connection Error', error)
})

database.once('connected', async () => {
    console.log('Successfully connected to MongoDB...')
})

app.use(cors())
app.use(express.json())

//ROUTES
app.use('/pets', petsRouter);
app.use('/feeder', feederRouter);
app.use('/chores', choreTrackerRouter);
app.use('/shoppingList', shoppingListRouter);
app.use('/recipe', recipeRouter);
app.use('/meal_plan', mealPlannerRouter);

app.listen(process.env.PORT || localPort, '0.0.0.0', () => {
    console.log(`Johnston Home Hub is listening on ${process.env.PORT ?? localPort}...`)
})
