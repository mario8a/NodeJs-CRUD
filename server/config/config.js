// =======================
// Puerto 
//==========================

process.env.PORT = process.env.PORT || 3000;

// =======================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
// Base de datos
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:mario23101996@ds129831.mlab.com:29831/cafe';
}

//esto es para cambiar la cadena de conexion de localhost
process.env.URLDB = urlDB;




//conexion local
//mongodb: //localhost:27017/cafe
//conexion remota
//mongodb: //<dbuser>:<dbpassword>@ds129831.mlab.com:29831/cafe//