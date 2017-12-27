'use strict'

// Cargar Modulos
var bcrypt = require('bcrypt-nodejs');

// Cargar Modelos
var User = require('../models/user');

// Cargar JWT
var jwt = require('../services/jwt');

// Definir acciones

// Metodo de Prueba
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de Usuarios y la accion pruebas'
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

// Exportar acciones
module.exports = {
    pruebas,
    saveUser,
    login
};