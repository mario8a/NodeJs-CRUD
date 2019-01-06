const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    //findOne solo regresa uno de los objetos, en este solo sera el email
    //{{email debe ser igual email}} que exista email
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //vereificar si no viene un user en la db
        //que el email es invalido
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        //evaluando la contraseña, si no es correcta
        //compare compara el pass encriptado con el que el que se logearon y ver si hace match
        //regresa true o false
        //(pass encriptado, pass que escribio en el login)
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }
        //creando el jsonwebtoken
        //el env se esta llamando de config.js igual el seed
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

module.exports = app;