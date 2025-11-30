const express = require('express')
require('dotenv').config()

const eventRoutes = require('./routes/events')
const vehicleRoutes = require('./routes/vehicles')

const app = express();
app.use(express.json());
app.use(eventRoutes);
app.use(vehicleRoutes);
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})