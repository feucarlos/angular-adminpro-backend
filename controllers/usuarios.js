const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    // const total = await Usuario.count();
    // const usuarios = await Usuario
    //                         .find({}, 'nombre email role google')
    //                         .skip(desde)
    //                         .limit(5);
    // Lo anterior se puede simplificar como: 

    const [usuarios, total] =await Promise.all([
        Usuario
            .find({}, 'nombre email role google')
            .skip(desde)
            .limit(5),
        Usuario.count()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
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
        
        // Guardar usuario
        await usuario.save();
        
        // Generar token
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    }

}

const actualizarUsuario = async (req, res = response) => {
    
    // TODO: validar token y comprobar si el usuario es correcto

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }
        
        const {password, google, email, ...campos} = req.body;
        
        if ( usuarioDB.email !== email ){

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;

        // Actualizaciones
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario con ese ID'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al intentar borrar el usuario: '
        });
    }
}

module.exports = { 
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}