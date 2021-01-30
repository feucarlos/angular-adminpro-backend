const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
    if ( fs.existsSync( path ) ){
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathAnterior = '';
    switch( tipo ) {
        case 'medicos':
            const medico = await Medico.findById( id );
            if (!medico) { 
                console.log('No se encontró un médico con el ID');
                return false;
            }
            pathAnterior = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathAnterior);
            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'hospitales':
            const hospital = await Hospital.findById( id );
            if (!hospital) { 
                console.log('No se encontró un hospital con el ID');
                return false;
            }
            pathAnterior = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathAnterior);
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
        case 'usuarios':
            const usuario = await Usuario.findById( id );
            if (!usuario) { 
                console.log('No se encontró un usuario con el ID');
                return false;
            }
            pathAnterior = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathAnterior);
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
         break;
    }

}

module.exports = {
    actualizarImagen
}