const express = require('express')
const router = express.Router()
const { getZone } = require('../services/state')

router.get('/vehicle/:id', (req, res) => {
    const vehicleId = req.params.id
    const zone = getZone(vehicleId)
    if (zone == null) {
        console.log(`Vehicle ${vehicleId} is currently not in any zone`)
    }
    res.json({ vehicleId, zone })
})

module.exports = router