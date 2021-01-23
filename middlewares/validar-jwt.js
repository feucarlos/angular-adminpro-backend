const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next ) => {
    // Leer el token
    const token = req.header('x-token');
    console.log(token);

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_KEY);
        req.uid = uid;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        })
    }


    next();
}

module.exports = {
    validarJWT
}