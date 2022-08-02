const express = require('express')
const fns = require('date-fns')

const router = express.Router()

const { FeedStatus } = require('../../models/FeederData/FeederData')
const { Pet } = require('../../models/Pet/Pet')
const {HTTPMessagesEnum} = require('../../constants')

router.get('/feederData', async (req, res) => {
    console.log('Fetting feeder data from `feeder/feederData`...')
    try {
        const allPets = await Pet.find()
        let [targetFeedStatus] = await FeedStatus.find({
            date: fns.format(new Date(), 'MM/dd/yyyy'),
        })

        if (!targetFeedStatus) {
            console.log('Generating new feed status...')
            targetFeedStatus = new FeedStatus({
                date: fns.format(new Date(), 'MM/dd/yyyy'),
                breakfst: [],
                dinner: [],
            })
            await targetFeedStatus.save()
        }

        const feederData = {
            pets: allPets,
            feedStatus: targetFeedStatus,
        }
        res.status(200).json({
            status: 200,
            message: HTTPMessagesEnum.FEEDER_DATA_FETCHED,
            data: feederData,
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error,
        })
    } finally {
        console.log('GET: feeder/feederData completed...')
    }
})

router.patch('/feederData', async (req, res) => {
    console.log('Updating feeder data from `feeder/feederData`...')
    try {
        const { targetDate, targetMeal, petsToUpdate } = req.body
        const updatedFeedStatus = await FeedStatus.findOneAndUpdate(
            { date: targetDate },
            { [targetMeal]: petsToUpdate },
            { new: true }
        )

        res.status(200).json({
            status: 200,
            message: HTTPMessagesEnum.FEEDER_DATA_PATCHED,
            data: updatedFeedStatus,
        })
    } catch (error) {
        console.error(error)
    } finally {
        console.log('PATCH: feeder/feederData completed...')
    }
})

module.exports = router
