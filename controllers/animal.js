'use strict'

// Cargar Modulos
var fs = require('fs');
var path = require('path');

// Cargar Modelos
var Animal = require('../models/animal');

// Definir acciones

// Metodo de Prueba
function pruebasAnimal(req, res){
    res.status(200).send({
        message: 'Probando el controlador de Animales y la accion pruebasAnimal',
        // Devuelve el Objeto del Usuario Logueado
        user: req.user
    })
}

// Metodo de Guardar Animal
function saveAnimal(req, res){
    var animal = new Animal();

    var params = req.body;

    if(params.name){
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save((err, animalStored) => {
            if(err){
                res.status(500).send({ message: 'Error en el Servidor' })
            }else{
                if(!animalStored){
                    res.status(404).send({ message: 'No se ha guardado el Animal' })
                }else{
                    res.status(200).send({ animal: animalStored })
                }
            }
        })
    }else{
        res.status(200).send({
            message: 'El nombre del Animal es Obligatorio',
        })
    }
}

// Exportar acciones
module.exports = {
    pruebasAnimal,
    saveAnimal
    
};