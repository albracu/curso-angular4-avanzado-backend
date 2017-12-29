'use strict'

// Cargar Modulos
var fs = require('fs');
var path = require('path');

// Cargar Modelos
var Animal = require('../models/animal');

// Cargar JWT
var jwt = require('../services/jwt');

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

// Metodo para Cargar imagen de Animal
function uploadImage(req, res){
    var animalId = req.params.id;
    var file_name = 'No subido..';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpng' || file_ext == 'gif'){
        
            Animal.findByIdAndUpdate(animalId, {image: file_name}, {new: true}, (err, animalUpdated) => {
                if(err){
                    res.status(500).send({
                        message: 'Error al actualizar usuario'
                    });
                }else{
                    if (!animalUpdated) {
                        res.status(404).send({message: 'No se ha podido utilizar el animal'});
                    }else{
                        res.status(200).send({ animal: animalUpdated, image: file_name });
                    }
                }
            });

        }else{
            fs.unlink(file_path, (err) => {
                if (err){
                    res.status(200).send({ message: 'Extension no valida y fichero no borrado'});
                }else{
                    res.status(200).send({ message: 'Extension no valida'});
                }
            });
        }

    }else{
        res.status(200).send({ message: 'No se ha subido archivos'});
    }
}

// Funcion para Mostrar Imagen de Animal
function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/animals/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'La imagen no existe'});
        }
    });   
}

function deleteAnimal(req, res){
    var animalId = req.params.id;

    Animal.findByIdAndRemove(animalId, (err, animalRemoved) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!animalRemoved){
                res.status(404).send({message: 'No se ha podido borrar el animal'});
            }else{
                res.status(200).send({animal: animalRemoved});
            }
        }
    })
}

// Exportar acciones
module.exports = {
    pruebasAnimal,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
};