import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Configuración del transportador de correos
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // Gmail, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Correo electrónico del remitente
    pass: process.env.EMAIL_PASS, // Contraseña o App Password
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo.");
  }
};
