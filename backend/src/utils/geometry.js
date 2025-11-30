//to calculate dist btwn 2 points on a sphere (earth)
function haversine(lat1, long1, lat2, long2) {
    const r = 6371000 //radius of earth
    const toRad = (deg) => (deg * Math.PI) / 180
    const latD = toRad(lat1 - lat2)
    const longD = toRad(long1 - long2)
    const havTheta = Math.sin(latD / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(longD / 2) ** 2
    const theta = Math.acos(1 - 2 * havTheta)
    return r * theta
}

//to find if a given point is in a zone
function isInside(point, zone) {
    const d = haversine(point.lat, point.long, zone.center.lat, zone.center.long)
    return d <= zone.radius
}
module.exports = { isInside }