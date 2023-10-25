const express = require('express')
const router = express.Router()

const { Pet } = require('../../models/Pet/Pet')
const {HTTPMessagesEnum} = require('../../constants')

router.get('/all', async (req, res) => {
//     console.log('Fetching pets from `pets/all`...')
//     try {
//         const pets = await Pet.find()
//         res.status(200).json({
//             status: 200,
//             message: HTTPMessagesEnum.PETS_FETCHED,
//             data: pets,
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: error,
//         })
//     } finally {
//         console.log('GET: pets/all completed')
//     }
res.status(200).json({
        status: 200,
        message: HTTPMessagesEnum.PETS_FETCHED,
        data: []
})
})

module.exports = router
