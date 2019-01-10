// =======================
// Puerto 
//==========================

process.env.PORT = process.env.PORT || 3000;

// =======================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
// Vencimiento del tokek
//60 seg * 60 min * 24 horas * 30 dias
//==========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// =======================
// Seed o semilla de auth
//==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed';

// =======================
// Base de datos
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

//esto es para cambiar la cadena de conexion de localhost
process.env.URLDB = urlDB;




//conexion local
//mongodb: //localhost:27017/cafe
//conexion remota
//mongodb: //<dbuser>:<dbpassword>@ds129831.mlab.com:29831/cafe//


// =======================
// Google client ID
//==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || "420338328011-0ooala3rme7si22l1b14e5kpp485du78.apps.googleusercontent.com"