const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth_routes');
const userRoutes = require('./routes/user_routes');
const capsuleRoutes = require('./routes/capsule_routes');
const geolocationRoutes = require('./routes/geolocation_route');
const logsRoute = require('./routes/logs_route');
const missionRoutes = require('./routes/mission_routes');
const bodyParser = require('body-parser');
const cors = require('cors');

// Konfigurasi dotenv
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/capsule', capsuleRoutes);
app.use('/geo-location', geolocationRoutes);
app.use('/logs', logsRoute);
app.use('/mission', missionRoutes);

module.exports = app;
