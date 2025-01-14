const {request, response} = require('express');
const Usuario = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const CrearUsuario = async(req = request, res = response) => {
    
    const {email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        if( usuario ) return res.status(400).json({ ok: false, msg: `El usuario ${usuario.email}, ya existe` });
        
        usuario = new Usuario( req.body );
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password.toString(), salt );
        
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }

}

const loginUsuario = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });
        if( !usuario ) return res.status(400).json({ ok: false, msg: `El usuario ${email}, no existe!`});
        
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ) return res.status(400).json({ ok: false, msg: 'Password incorrecto' });


        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
        
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }

}

const revalidarToken = async( req = request, res = response ) =>{

    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT(uid, name);
    if( !token ) return res.status(500).json({ok:false, msg: 'No se pudo generar el token'});

    res.json({
        ok: true,
        uid,
        name,   
        token
    });
};


module.exports = {
    CrearUsuario,
    loginUsuario,
    revalidarToken
}