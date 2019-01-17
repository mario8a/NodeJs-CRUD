const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'no se ha seleccionado ningun archivo'
                }
            });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos validos son ' + tiposValidos.join(', ')
            }
        });

    }


    //archivo es el nombre que se le coloca al hacer un input
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];



    //Extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //comprobando si la extencion es valida
    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son ' + extencionesValidas.join(', '),
                ext: extencion
            }
        });
    }
    //cambiando nombre al archvivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extencion}`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //imagen cargadda correctamente
        //condicion para diferenciar una de otra al cargar
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        /*//validando si la imagen existe, si existe se remplaza
        let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }*/

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }


        borraArchivo(productoDB.img, 'productos');


        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });

}

function borraArchivo(nombreImagen, tipo) {

    //validando si la imagen existe, si existe se remplaza
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;