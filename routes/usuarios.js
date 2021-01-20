/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, crearUsuario, actualizarUsuario } = require('../controllers/usuarios');


const router = Router();


router.get('/', getUsuarios );

router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'No es un email válido').isEmail(),
        validarCampos,
    ],
    crearUsuario
);
    
router.put('/:id',
    [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'No es un email válido').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty()
    ],
    actualizarUsuario
);

module.exports = router;