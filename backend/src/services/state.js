//stores the last zone of each vehicle

const zones = new Map()
function getZone(vehicleId) {
    const zone = zones.get(vehicleId) || null
    return zone
}

function setZone(vehicleId, zoneId) {
    zones.set(vehicleId, zoneId)
}

module.exports = { getZone, setZone }