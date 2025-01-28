import Admin from "../models/admin.model.js";
import { validarEmail, validarTelefono } from "../libs/regexValidation.js";
import { sendEmail } from "../libs/emailSender.js";
import { generateToken, verifyToken } from "../libs/tokenManager.js";

export const createAdmin = async (req, res) => {
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

    // Crear el administrador **sin contraseña**
    const newAdmin = new Admin({
      fullName,
      email,
      phoneNumber,
      homeAddress,
    });

    // Guardar en la base de datos
    const savedAdmin = await newAdmin.save();

    // Generar un token
    const token = generateToken({ adminId: savedAdmin._id });
    console.log("Token generado:", token);

    // Crear enlace de configuración de contraseña
    const FRONTEND_URL = process.env.FRONTEND_URL;

    const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}&role=admin`;

    // Enviar correo electrónico con el enlace
    await sendEmail({
      to: email,
      subject: "Configura tu contraseña",
      html: `
        <p>Hola ${fullName},</p>
        <p>Has sido registrado como administrador en nuestro sistema. Por favor, haz clic en el siguiente enlace para configurar tu contraseña:</p>
        <a href="${resetPasswordLink}">Configurar contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.status(201).json({
      message: "Administrador creado. Se envió un correo para configurar la contraseña.",
      admin: savedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los administradores", error });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      console.error("Token no proporcionado.");
      return res.status(400).json({ message: "Token no proporcionado." });
    }

    console.log("Token recibido:", token);

    // Verificar el token
    const decoded = verifyToken(token);
    const adminId = decoded.adminId;

    console.log("Token decodificado:", decoded);

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Por favor, proporciona una nueva contraseña." });
    }

    // Buscar al administrador por su ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado." });
    }

    // Actualizar la contraseña
    admin.password = password;

    // Guardar el administrador para que el middleware de hashPassword se ejecute
    const updatedAdmin = await admin.save();

    res.status(200).json({ message: "Contraseña configurada exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};

// Cambiar contraseña de administrador
export const requestPasswordChange = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar al administrador por correo electrónico
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado." });
    }

    // Generar un token con el ID del administrador
    const token = generateToken({ adminId: admin._id });
    console.log("Token generado para cambio de contraseña:", token);

    // Crear enlace para cambiar contraseña
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}&role=admin`;

    // Enviar correo electrónico con el enlace
    await sendEmail({
      to: email,
      subject: "Cambio de contraseña",
      html: `
        <p>Hola ${admin.fullName},</p>
        <p>Has solicitado cambiar tu contraseña. Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
        <a href="${resetPasswordLink}">Cambiar contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.status(200).json({
      message: "Se envió un correo para cambiar la contraseña.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
