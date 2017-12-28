'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Declaracion de rutas Api REST
api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);

api.post('/register', UserController.saveUser);

api.post('/login', UserController.login);

api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;