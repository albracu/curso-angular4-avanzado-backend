'use strict'

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de Usuarios y la accion pruebas'
    })
}

module.exports = {
    pruebas
};