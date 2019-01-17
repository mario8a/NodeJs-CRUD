const jwt = require('jsonwebtoken');

// =================
//Verificar token
//==================
//loque hace next continar con la ejecicaion del programa
let verificaToken = (req, res, next) => {

    ///obteniendo los headers del postman en este caso se escribio token en el header
    let token = req.get('token');

    //funcion de jwt  para verificar que el token sea valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};


// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};


// =====================
// Verifica token en  imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}