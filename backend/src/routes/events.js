const express = require('express')
const router = express.Router()
const { processEvent } = require('../services/geofence')

router.post('/tracking', (req, res) => {
    const { vehicleId, lat, long, timestamp } = req.body
    if (!vehicleId || !lat || !long) {
        return res.status(400).json({ error: "Missing fields" })
    }
    if (isNaN(lat) || isNaN(long) || lat < -90 || lat > 90 || long < -180 || long > 180) {
        return res.status(400).json({ error: "Invalid coordinates" })
    }
    try {
        const result = processEvent({ vehicleId, lat, long })
        res.json(result)
    } catch (err) {
        console.error("Error: ", err)
        res.status(500).json({ error: "Server error" })
    }
})

module.exports = router