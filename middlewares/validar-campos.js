const { request, response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req = request, res = response, next) => {
    // Manejo de errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        })
    }

    next();
}

module.exports = {
    validarCampos,
    
}