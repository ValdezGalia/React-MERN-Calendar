const { request, response } = require('express');
const Evento = require('../models/EventoModel');

const getEventos = async(req = request, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    return res.status(200).json({
        ok: true,
        eventos
    })
}

const crearEvento = async(req = request, res = response) => {
    
    const eventSaved = new Evento(req.body);

    try {

        eventSaved.user = req.uid;

        await eventSaved.save();
            
        return res.status(200).json({
            ok: true,
            eventSaved
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin',
        })
    }
}

const actualizarEvento = async(req = request, res = response) => {
    
    try {

        const eventoId = req.params.id;
        const evento = await Evento.findById(eventoId);
        if( !evento ) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });
        if( evento.user.toString() !== req.uid ) return res.status(401).json({ ok: false, msg: 'No tiene permiso para editar este evento' });

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const eventUpdated = await Evento.findByIdAndUpdate(eventoId, newEvent, { new: true });
        

        return res.status(200).json({
            ok: true,
            eventUpdated
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg: 'Hable con el admin',
        })
    }
    
}

const eliminarEvento = async(req = request, res = response) => {
    try {

        const eventoId = req.params.id;
        const evento = await Evento.findById(eventoId);
        if( !evento ) return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });
        if( evento.user.toString() !== req.uid ) return res.status(401).json({ ok: false, msg: 'No tiene permiso para Eliminar este evento' });

        await Evento.findByIdAndDelete(eventoId, { new: true });
        
        return res.status(200).json({
            ok: true
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg: 'Hable con el admin',
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}