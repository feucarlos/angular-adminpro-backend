const { response } = require('express');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async( req, res=response )=>{

    const googleToken = req.body.token;

    try {
        const {name, email, picture} = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '***',
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Guardar el TOKEN - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            msg: 'Google SignIn',
            token
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Error al autenticarse',
        })
    }

}

module.exports = {
    login,
    googleSignIn
}