'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'})

// Declaracion de rutas Api REST
api.get('/pruebas-animales', md_auth.ensureAuth, AnimalController.pruebasAnimal);

api.post('/animal', md_auth.ensureAuth, AnimalController.saveAnimal);

api.get('/animals', AnimalController.getAnimals);

api.get('/animal/:id', AnimalController.getAnimal);

api.put('/animal/:id', md_auth.ensureAuth, AnimalController.updateAnimal);

api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload], AnimalController.uploadImage);

api.get('/get-image-animal/:imageFile', AnimalController.getImageFile);

module.exports = api;