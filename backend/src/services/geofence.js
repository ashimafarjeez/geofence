const zones = require('../config/zones.json')
const { isInside } = require('../utils/geometry')
const { getZone, setZone } = require('./state')

function detectZone(point) {
    for (const zone of zones) {
        if (zone.type == "circle" && isInside(point, zone)) {
            return zone.id;
        }
    }
    return null;
}

function processEvent({ vehicleId, lat, long }) {
    const point = { lat, long }
    const newZone = detectZone(point);
    const oldZone = getZone(vehicleId);
    if (oldZone != newZone) {
        if (oldZone) console.log(`Vehicle ${vehicleId} exited ${oldZone}`)
        if (newZone) console.log(`Vehicle ${vehicleId} entered ${newZone}`)
    }
    if (!oldZone && newZone) console.log(`First time seeing vehicle ${vehicleId}`)
    if (!newZone && oldZone) console.log(`Vehicle ${vehicleId} exited all zones`)
    setZone(vehicleId, newZone)
    return { oldZone, newZone }
}

module.exports = { processEvent }