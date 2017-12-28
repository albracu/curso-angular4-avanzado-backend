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

// Metodo para listar Animales
function getAnimals(req, res){
    Animal.find({}).populate({path: 'user'}).exec((err, animals) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            })
        }else{
            if(!animals){
                res.status(404).send({
                    message: 'No hay animales'
                })
            }else{
                res.status(200).send({
                    animals
                })
            }
        }
    });
}

// Metodo para devolver un Animal concreto
function getAnimal(req, res){
    var animalId = req.params.id;

    Animal.findById(animalId).populate({path: 'user'}).exec((err, animal) =>{
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            })
        }else{
            if(!animal){
                res.status(404).send({
                    message: 'El Animal no existe'
                })
            }else{
                res.status(200).send({
                    animal
                })
            }
        }
    })
}

// Metodo para actualizar un Animal
function updateAnimal(req, res){
    var animalId = req.params.id;
    var update = req.body;

    // Si le pasamos como tercer parametro el objeto {new: true}, nos devuelve el objeto ya actualizado
    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdated) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!animalUpdated){
                res.status(404).send({
                    message: 'No se ha actualizado el Animal'
                })
            }else{
                res.status(200).send({
                    animal: animalUpdated
                })
            }
        }
    });
}

// Exportar acciones
module.exports = {
    pruebasAnimal,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal
    
};