require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const bodyParser = require('body-parser');

//los app.use se llaman middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//habilitar carpeta public donde viene el index.html
app.use(express.static(path.resolve(__dirname, '../public')));


//de esta manera importams las rutas haciendo referencia al index
//config global de rutas
app.use(require('./routes/index'));


//CONEXION A MONGO DB A SU BASE DE DATOS CAFE
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log("Base de datos online");

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});