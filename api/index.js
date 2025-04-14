const serverless = require('serverless-http');
const app = require('../src/index');  // Mengimpor aplikasi Express dari src/index.js

module.exports.handler = serverless(app);
