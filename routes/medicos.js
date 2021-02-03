/*
    Médicos
    /api/medico
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos');
const Hospital = require('../models/hospital');


const router = Router();


router.get('/', getMedicos );

router.post(
    '/',
    [
        validarJWT,
        check('hospital', 'El hostipal id debe ser válido').isMongoId(),
        check('nombre', 'Se requiere el nombre del médico').notEmpty(),
        validarCampos
    ],
    crearMedico
);
    
router.put('/:id', 
[
    validarJWT,
    check('hospital', 'El hostipal id debe ser válido').isMongoId(),
    check('nombre', 'Se requiere el nombre del médico').notEmpty(),
    validarCampos
],
actualizarMedico );

router.delete('/:id', validarJWT, borrarMedico );

module.exports = router;