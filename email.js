const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Función para enviar correo electrónico
function enviarCorreo() {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_to,
        subject: 'Hora disponible',
        html: `<h3>Revisar especialidad de oftalmología:</h3></br><h3><a href="${process.env.URL}">Ver página</a></h3>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}

module.exports = { enviarCorreo };