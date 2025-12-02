# Geofence event processing service
A lightweight Node.js service that processes real-time GPS location events from vehicles, detects geofence zone entry/exit, and exposes an API to query each vehicle’s current zone.
This project was built as part of the *Geofence Event Processing Challenge* and demonstrates practical engineering decisions, clean structure, error handling, and awareness of operational concerns.

## Features
* Accepts **vehicle location events** via HTTP POST
* Detects **zone entry**, **zone exit**, and **cross-zone transitions**
* Maintains **in-memory state** of each vehicle’s last known zone
* Provides a GET API to query any vehicle’s current zone
* Includes logging for operational visibility
* Validates inputs and handles edge cases

## Project Structure

```
geofence/
  backend/
    src/
      config/
         zones.json        # Geofence zone definitions
      routes/
         events.js         # POST /tracking route
         vehicles.js       # GET /vehicle/:id route
      services/
         geofence.js       # Event processing + zone detection logic
         state.js          # In-memory vehicle zone tracking
      utils/
         geometry.js       # Haversine distance + point-inside-zone check
      index.js             # Express server entry point
```

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/ashimafarjeez/geofence
cd geofence/backend/src
```

### 2. Install Dependencies

```
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file:
```
PORT=3000
```

### **4. Start the Server**

```
node index.js
```
You should see:
```
Server running on port 3000
```

## API Endpoints

### POST `/tracking` (Send GPS event)

**Body Example:**
```json
{
  "vehicleId": "ABC123",
  "lat": 28.73,
  "long": 43.86,
  "timestamp": 17000000
}
```

**Response:**

```json
{
  "oldZone": null,
  "newZone": "university"
}
```

**Logs to console:**
* Entry and exit from zones
* First time spotting of vehicles
* Vehicle exiting all geofence zones


### GET `/vehicle/:id` (Query vehicle zone)

Example:
```
GET /vehicle/ABC123
```

**Response:**
```json
{
  "vehicleId": "ABC123",
  "zone": "university"
}
```
If the vehicle is not in any of the defined zones:
```
{
  "vehicleId": "ABC123",
  "zone": null
}
```

**Logs to console:**  
* If the vehicle is not present in any of the zones

## How Zone Detection Works

1. Vehicle sends (lat, long)
2. `detectZone()` loops through each zone in `zones.json`
3. For circular zones, it computes distance using the **Haversine formula**
4. If distance <= radius, then the vehicle is inside that zone
5. The system compares:
   * `oldZone = getZone(vehicleId)`
   * `newZone = detectZone(point)`
6. Logs events such as:
   * entered zone
   * exited zone
7. Updates stored state with `setZone(vehicleId, newZone)`
In-memory state is stored in a `Map()` for O(1) lookups.

## Design Decisions

### Why in-memory `Map()` for state?

* Extremely fast for lookups
* No persistence required for this challenge
* Suitable for a stateless prototype

### Why Haversine?

GPS coordinates lie on a sphere and so Euclidean distance would be incorrect

## Edge Cases Considered

* Missing fields: returns 400 with message
* Invalid coordinates: returns 400
* Vehicle outside all zones: zone is set to `null` and logged to console
* Vehicle appears for the first time: logged to console
* Coordinates on boundary: treated to be inside the zone
* GET request for an unknown vehicle: returns `{zone:null}` and logged to console
* Multiple vehicles at same coordinates: Map tracks each vehicle's state independently

## Assumptions

* Zones are only circular (since the challenge suggested simple geographic zones)
* No persistent database required
* No authentication needed
* No overlapping zones
* `zones.json` has properly defined zones with no malformed lat/long values

## Possible Improvements

### Handling vehicle exactly on the boundary of 2 different zones

* Storing an array of zones for a vehicle and return both zones (complicates entry/exit logic since we will have to compare arrays)
* Assign priority field in `zones.json` and assign the vehicle to the highest priority zone

### Handling overlapping zones

* Storing an array of zones for a vehicle and return both the zones (complicates entry/exit logic since we will have to compare arrays)
* Assign priority field in `zones.json` and assign the zone with higher priority
  
### Persistence

* Replacing Map() with Redis or database
* Allows horizontal scaling

### Polygon support

* Could integrate point-in polygon algorithms

### Rate limiting & auth

* Prevent abuse of public API

## Conclusion

This solution demonstrates clear architectural organization, input validation, event processing logic, and operational awareness. It fulfills all requirements of the challenge while keeping the codebase simple, readable, and extensible.
