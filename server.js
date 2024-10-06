const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/Biometricsoccer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definir el esquema y el modelo
const UserSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// Configurar bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para procesar el registro
app.post('/procesar_registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    const newUser = new User({ nombre, email, password });
    await newUser.save();
    res.send('Registro exitoso');
});

// Ruta para procesar el inicio de sesión
app.post('/procesar_login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.send('Inicio de sesión exitoso');
    } else {
        res.send('Usuario o contraseña incorrectos');
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
