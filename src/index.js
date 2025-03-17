const express = require('express')
const app = express()
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth_routes')
const userRoutes = require('./routes/user_routes')
const capsuleRoutes = require('./routes/capsule_routes')
const geolocationRoutes = require('./routes/geolocation_route')
const bodyParser = require('body-parser')
dotenv.config()

const port = process.env.SERVER_PORT || 3001

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth' , authRoutes )
app.use('/user' , userRoutes )
app.use('/capsule' , capsuleRoutes)
app.use('/geo-location' , geolocationRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})