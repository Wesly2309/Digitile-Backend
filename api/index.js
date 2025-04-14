const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const authRoutes = require('../src/routes/auth_routes'); // Pastikan path sesuai dengan file Anda
const userRoutes = require('../src/routes/user_routes');
const capsuleRoutes = require('../src/routes/capsule_routes');
const geolocationRoutes = require('../src/routes/geolocation_route');
const logsRoute = require('../src/routes/logs_route');
const missionRoutes = require('../src/routes/mission_routes');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load konfigurasi .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definisikan rute-rute Anda
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/capsule', capsuleRoutes);
app.use('/geo-location', geolocationRoutes);
app.use('/logs', logsRoute);
app.use('/mission', missionRoutes);

// Ekspor aplikasi Express sebagai serverless function menggunakan serverless-http
module.exports.handler = serverless(app);
