const routes = require('express').Router();
routes.get("/", (req, res) => {res.send("<h1>Hola mundo</h1>")});