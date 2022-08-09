const routes = require('express').Router();
const authRoutes = require('./auth/authRoute');
routes.use('/auth', authRoutes);
module.exports = routes;