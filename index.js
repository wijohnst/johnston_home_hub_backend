require('dotenv').config()

const cors = require('cors')
const mongoString = process.env.DATABASE_URL
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3001

mongoose.connect(mongoString)
const database = mongoose.connection

const petsRouter = require('./routes/Pets/pets')
const feederRouter = require('./routes/Feeder/feeder')

database.on('error', (error) => {
    console.log('DB Connection Error', error)
})

database.once('connected', async () => {
    console.log('Successfully connected to MongoDB...')
})

app.use(cors())
app.use(express.json())

//ROUTES
app.use('/pets', petsRouter)
app.use('/feeder', feederRouter)

app.listen(port, () => {
    console.log(`Johnston Home Hub is listening on port ${port}`)
})
