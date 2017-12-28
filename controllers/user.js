'use strict'

// Cargar Modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// Cargar Modelos
var User = require('../models/user');

// Cargar JWT
var jwt = require('../services/jwt');

// Definir acciones

// Metodo de Prueba
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de Usuarios y la accion pruebas',
        user: req.user
    })
}

// Metodo de Registro de usuario
function saveUser(req, res){
    // Crear el Objeto del Usuario
    var user = new User();

    // Recoger los parametros de la peticion
    var params = req.body;

    // console.log(params);

    if(params.password && params.name && params.surname && params.email){
        // Asignar valores al Objeto
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({ email: user.email.toLowerCase()}, (err, issetUser) => {
            if(err){
                res.status(500).send({ message: 'Error al comprobar que el usuario existe' });
            }else{
                if(!issetUser){
                    // Cifrar contraseña
                    bcrypt.hash(params.password, null, null, function(error, hash){
                        user.password = hash;

                        // Guardar usuario en BD
                        user.save((err, userStored) => {
                            if(err){
                                res.status(500).send({ message: 'Error al guardar el usuario' });
                            }else{
                                if(!userStored){
                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                }else{
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        });
                    });

                }else{
                    res.status(200).send({
                        message: 'El usuario no puede registrarse'
                    });
                }
            }
        });
            

    }else{
        res.status(200).send({
            message: 'Introduce bien los datos para poder crear el usuario'
        });
    }
}

// Metodo de Login
function login(req, res){

    // Comprobar que el usuario existe
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({ message: 'Error al comprobar que el usuario existe' });
        }else{
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        // Comprobar si existe gettoken y Generar el Token
                        if (params.gettoken) {
                            // Devolver el Token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            
                        }
                        res.status(200).send({user});
                    }else{
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse correctamente'
                        });
                    }
                });
            }else{
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });
}

// Metodo para Actualizar Usuarios
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({ message: 'No tiene permisos para actualizar el usuario' });
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if(err){
            res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        }else{
            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido utilizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

// Metodo para Cargar imagen de usuario
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido..';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpng' || file_ext == 'gif'){

            if(userId != req.user.sub){
                return res.status(500).send({ message: 'No tiene permisos para actualizar el usuario' });
            }
        
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if(err){
                    res.status(500).send({
                        message: 'Error al actualizar usuario'
                    });
                }else{
                    if (!userUpdated) {
                        res.status(404).send({message: 'No se ha podido utilizar el usuario'});
                    }else{
                        res.status(200).send({ user: userUpdated, image: file_name });
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

// Funcion para Mostrar Imagen
function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'La imagen no existe'});
        }
    });   
}

function getKeepers(req, res){
    User.find({role: 'ROLE_ADMIN'}).exec((err, users)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!users){
                res.status(404).send({message: 'No hay cuidadores'});  
            }else{
                res.status(200).send({users});
            }
        }
    })
}

// Exportar acciones
module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
};