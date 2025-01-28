import Operator from "../models/operator.model.js";
import { validarEmail, validarTelefono } from "../libs/regexValidation.js";
import { sendEmail } from "../libs/emailSender.js";
import { generateToken, verifyToken } from "../libs/tokenManager.js";

export const createOperator = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, homeAddress } = req.body;

    // Validar email
    if (!validarEmail(email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido." });
    }

    // Validar teléfono
    if (!validarTelefono(phoneNumber)) {
      return res.status(400).json({ message: "El número de teléfono no es válido." });
    }

    // Crear el operador **sin contraseña**
    const newOperator = new Operator({
      fullName,
      email,
      phoneNumber,
      homeAddress,
    });

    // Guardar en la base de datos
    const savedOperator = await newOperator.save();

    // Generar un token
    const token = generateToken({ operatorId: savedOperator._id });
    console.log("Token generado:", token); // <-- Verifica que el token sea válido

    // Crear enlace de configuración de contraseña
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}&role=operator`;

    // Enviar correo electrónico con el enlace
    await sendEmail({
      to: email,
      subject: "Configura tu contraseña",
      html: `
        <p>Hola ${fullName},</p>
        <p>Has sido registrado como operador en nuestro sistema. Por favor, haz clic en el siguiente enlace para configurar tu contraseña:</p>
        <a href="${resetPasswordLink}">Configurar contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.status(201).json({
      message: "Operador creado. Se envió un correo para configurar la contraseña.",
      operator: savedOperator,
    });
    console.log('Operador creado. Se envió un correo para configurar la contraseña.');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOperators = async (req, res) => {
  try {
    const operators = await Operator.find();
    res.status(200).json(operators);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los operadores", error });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { token } = req.params;  // Cambiado a req.query para obtener el token desde la URL

    if (!token) {
      console.error("Token no proporcionado.");
      return res.status(400).json({ message: "Token no proporcionado." });
    }

    console.log("Token recibido:", token);

    // Verificar el token utilizando tokenManager
    const decoded = verifyToken(token);
    const operatorId = decoded.operatorId;

    console.log("Token decodificado:", decoded);

    // Obtener la nueva contraseña desde el cuerpo de la solicitud
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Por favor, proporciona una nueva contraseña." });
    }

    // Buscar al operador por su ID
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return res.status(404).json({ message: "Operador no encontrado." });
    }

    // Actualizar la contraseña
    operator.password = password;  // Asignar la nueva contraseña

    // Guardar el operador para que el middleware de hashPassword se ejecute
    const updatedOperator = await operator.save(); 

    res.status(200).json({ message: "Contraseña configurada exitosamente." });
  } catch (error) {
    console.error(error);  // Para ver detalles del error
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};

// Cambiar contraseña de operador
export const requestPasswordChange = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el operador existe
    const operator = await Operator.findOne({ email });
    if (!operator) {
      return res.status(404).json({ message: "Operador no encontrado." });
    }

    // Generar un token
    const token = generateToken({ operatorId: operator._id });

    // Crear enlace para cambiar contraseña
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}&role=operator`;

    // Enviar correo electrónico con el enlace
    await sendEmail({
      to: email,
      subject: "Cambio de contraseña",
      html: `
        <p>Hola ${operator.fullName},</p>
        <p>Recibimos una solicitud para cambiar tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetPasswordLink}">Cambiar contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.status(200).json({ message: "Correo enviado para cambiar la contraseña." });
    console.log('Correo enviado para cambiar la contraseña.');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};