const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const Usuario = require('../models/usuario');

const app = express();



app.get('/usuario', function(req, res) {

    //{estado : true} para mostrar solo los de estado activo

    //definiciendo parametros opcionales si la persona que REGISTRO quiere
    //asi se lee. si viene una variable desde, si no, empieza desde la pagina 0 (1)
    let desde = req.query.desde || 0;
    //esto lo transforma en un numero
    desde = Number(desde);
    //definiendo desde que PAGINA se quiere
    let limite = req.query.limite || 5;
    limite = Number(limite);
    //haciendo referencia al schema
    //con el metodo find regresa todo sobre el usuario
    //{{especificando condicion}} funcion de mongoose
    //ejemplo de condicion ({google: true})
    //con los '' es un string de los campos que queremos mostrar
    //limit -> numero de registros que se van a mostrar
    //skip- -> muestra los primeros (5) registros, con limit muestra los siguentes 5, executa
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //retornando el numero total de registros
            //count({condicion},callback), la condicion debe ser la misma que esta arriba para que los cuente de la misma manera
            Usuario.count({ estado: true }, (err, conteo) => {
                //el res se movio desde de esta funcion de count
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
});
//POSTMAN {{url}}/usuario?limite=5&desde=10

//POST ES PARA CREAR NUEVOS REGISTROS
app.post('/usuario', function(req, res) {

    let body = req.body;

    //esto crea una unstancia del esquema usuario con sus  propiedades
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //guardando en la base de datos
    //pasan 2 parametros error, respuesta

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

//PUT ES PARA ACTUALZAR REGISTROS
app.put('/usuario/:id', function(req, res) {
    //ese id despues del params se refiera al id de arriba (/:id)
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //Usuario es el modelo
    //id, objeto para actializar, {opciones},callback
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


});

app.delete('/usuario/:id', function(req, res) {
    //obnteniendo el id
    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuaioBorrado) => {
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuaioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        //evaluar si existe un usuario borrado
        if (!usuaioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        //si se borra
        res.json({
            ok: true,
            usuario: usuaioBorrado
        });
    });

});

module.exports = app;