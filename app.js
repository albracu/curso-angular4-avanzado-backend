'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar Rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

// middleware de body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors


// rutas base
app.use('/api', user_routes);
app.use('/api', animal_routes);


module.exports = app;