const express = require('express');

const app = express();

//de esta manera importams las rutas del usuario
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;