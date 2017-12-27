'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();

// Cargar Rutas


// middleware de body-parser
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());

// Configurar cabeceras y cors


// rutas body-parser

app.get('/probando', (req, res) =>{
    res.status(200).send({message: 'Este es el metodo probando'});
});

module.exports = app;