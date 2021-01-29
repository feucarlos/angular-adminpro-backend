const { response, json } = require('express');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

const getBusqueda = async (req, res=response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    // const usuarios = await Usuario.find( { nombre: regex } );

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex })
    ]);

    try {


        res.json({
            ok: true,
            usuarios,
            medicos, 
            hospitales
        });
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error en la busqueda. Intentelo otra vez y si el problema continua contacte con el amdinistrador'
        });
        
    }

}

const getDocsCollection = async (req, res=response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    let data = [];

    try {
        switch ( tabla ){
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre img');
                break;
            case 'usuarios':
                data = await Usuario.find({ nombre: regex });
                break;
            default: 
                return res.status(400).json({
                ok: false,
                msg: "Error en colección. Debe ser medicos/hospitales/usuarios"
            });
        }

        res.json({
            ok: true,
            resultados: data
        });



    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error en la busqueda. Intentelo otra vez y si el problema continua contacte con el amdinistrador'
        });
        
    }

}

module.exports = {
    getBusqueda,
    getDocsCollection
}
