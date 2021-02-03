const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req, res=response) => {

    const medicos = await Medico.find()
            .populate('usuario', 'nombre')
            .populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async(req, res=response) => {

    const uid = req.uid;
    
    const medico  = new Medico({ usuario: uid, ...req.body });

    try {

        const medicosDB = await medico.save();

        res.json({
            ok: true,
            medico: medicosDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, contacte con el administrador.'
        });
        
    }

}

const actualizarMedico = async(req, res=response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById( id );
        
        if ( !medico ){
            return res.status(500).json({
                ok: false,
                msg: 'No se encontró al médico con el ID proporcionado'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medico: medicoActualizado
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actulizar el registro del médico'
        })
        
    }

}

const borrarMedico = async(req, res=response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById( id );
        if ( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado por ID'
            })
        }

        await Medico.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Médico eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar el registro del médico'
        });
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
