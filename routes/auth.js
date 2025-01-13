/**
 * 
 * Rutas de usuarios /auth
 * host + /api/auth
 * 
 */

const { Router } = require('express');
const { CrearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();


router.post('/',[
    //middlewares
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email tiene que ser de tipo email').isEmail(),
    check('password', 'La contraseña debe tener 6 caracteres').isLength({min: 6}),
    validarCampos,
] , loginUsuario);

router.post('/new', [
    //middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email tiene que ser de tipo email').isEmail(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser de 6 caracteres').isLength({min: 6}),
    validarCampos,

], CrearUsuario);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;