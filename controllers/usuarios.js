const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {

    const usuario = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuario
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'usuario ya existe'
            });
        }

        const usuario = new Usuario( req.body );

        // Enciptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();
        
        res.json({
            ok: true,
            usuario
        });
    } catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    }

}

module.exports = { 
    getUsuarios,
    crearUsuario,
}