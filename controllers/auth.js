const { response } = require('express');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res= response ) => {

    const { email, password } = req.body;

    try {
        // verifica si existe usuario
        const usuarioDB = await Usuario.findOne( {email} );
        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario y/o contraseña no válido'
            })
        }

        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario y/o contraseña no válido'
            })
        }

        // Generar token - JWT
        const token = await generarJWT( usuarioDB._id );

        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Póngase en contacto con el administrador'
        });
        
    }
}

module.exports = {
    login
}