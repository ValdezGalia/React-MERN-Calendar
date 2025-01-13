/**
 * 
 * Rutas de eventos /events
 * host + /api/events
 * 
 */

const { Router } = require('express');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const validarJWT = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const isDate = require('../helpers/isDate');
const router = Router();

// Todas las peticiones tienen que pasar por la validacion del JWT
router.use(validarJWT);

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo evento
router.post('/', [
    check('title', 'El titulo es obligatorio').notEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'La fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos
], crearEvento);

// Actualizar un nuevo evento
router.put('/:id', actualizarEvento);

// Borrar un nuevo evento
router.delete('/:id', eliminarEvento);

module.exports = router;
