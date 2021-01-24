const { response } = require('express');

const getMedicos = (req, res=response) => {
    res.json({
        ok: true,
        msg: 'getMedicos'
    });
}

const crearMedico = (req, res=response) => {
    res.json({
        ok: true,
        msg: 'crearMedico'
    });
}

const actualizarMedico = (req, res=response) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    });
}

const borrarMedico = (req, res=response) => {
    res.json({
        ok: true,
        msg: 'borrarMedico'
    });
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
