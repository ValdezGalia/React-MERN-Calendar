const express = require('express');
const { connectDB } = require('./databases/config');
const cors = require('cors');
require('dotenv').config();
// crear el servidor express

const app = express();

// Base de datos
connectDB();

// cors
app.use(cors());

// directorio publico
app.use(express.static('public'));

// parseo y lectura del body
app.use(express.json());

// rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// TODO: CRUD: eventos

// escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`);
});

