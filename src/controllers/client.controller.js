//importa el modelo cliente, configurado en Moongoose para interactuar con la base de datos
import Client from "../models/client.model.js";
//importa la validacion regex
import { validarEmail, validarTelefono, validarContrasena } from "../libs/regexValidation.js";
import { generateToken, verifyToken } from "../libs/tokenManager.js";
import { sendEmail } from "../libs/emailSender.js";
import { verifyCaptcha } from "../libs/captchaUtils.js"; // Importar la función de captcha

export const createClient = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, captchaToken } = req.body;
    
    console.log('Token del CAPTCHA:', captchaToken);
    // Validar token del captcha
    if (!captchaToken) {
       return res.status(400).json({ error: "El token del captcha es obligatorio." });
     }

     const captchaResult = await verifyCaptcha(captchaToken);
     if (!captchaResult.success) {
       return res.status(400).json({ error: "El captcha no es válido." });
     }

    // Validaciones de ingreso de datos
    if (!validarEmail(email)) {
      return res.status(400).json({ error: "El correo electrónico no es válido." });
    }
    if (!validarTelefono(phoneNumber)) {
      return res.status(400).json({ error: "El número de teléfono no es válido." });
    }
    if (!validarContrasena(password)) {
      return res.status(400).json({ error: "La contraseña no cumple con los requisitos." });
    }

    // Crear cliente pero no activarlo aún
    const newClient = new Client(req.body);
    //guarda el cliente en la base de datos
    await newClient.save();

    // Generar token único para activación
    const token = generateToken({ id: newClient._id });

    // Enviar correo de confirmación
    const activationLink = `${process.env.BACKEND_URL}/api/clients/activate/${token}`;
    await sendEmail({
      to: email,
      subject: "Activación de cuenta",
      html: `<p>Hola ${fullName},</p>
             <p>Por favor, activa tu cuenta haciendo clic en el siguiente enlace:</p>
             <a href="${activationLink}">Activar cuenta</a>`,
    });

    res.status(201).json({
      message: "Cliente registrado. Por favor revisa tu correo para activar tu cuenta.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint para activar la cuenta
export const activateClient = async (req, res) => {
  try {
    //desencripta
    const { token } = req.params;
    const decoded = verifyToken(token); // Verificar el token

    const client = await Client.findById(decoded.id);
    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    client.isActive = true; // Activar cuenta
    client.lastLogin = new Date(); // Establecer la fecha de primer inicio de sesión
    client.isEnabled = true; // Establecer cliente como activo

    await client.save();

    res.status(200).json({ message: "Cuenta activada exitosamente." });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

export const setPassword = async (req, res) => {
  try {
    // Obtener el token de la URL
    const { token } = req.params;  // Se usa req.params para obtener el token de la URL

    if (!token) {
      console.error("Token no proporcionado.");
      return res.status(400).json({ message: "Token no proporcionado." });
    }

    console.log("Token recibido:", token);

    // Verificar el token utilizando verifyToken
    const decoded = verifyToken(token);
    //const clientId = decoded.id;
    const clientId = decoded.clientId;

    console.log("Token decodificado:", decoded);
    console.log("ID del cliente:", clientId);

    // Obtener la nueva contraseña desde el cuerpo de la solicitud
    const { password } = req.body;
    if (!password) {
      console.log("La contraseña no fue proporcionada.");
      return res.status(400).json({ message: "Por favor, proporciona una nueva contraseña." });
    }

    // Validar la contraseña
    if (!validarContrasena(password)) {
      return res.status(400).json({ message: "La contraseña no cumple con los requisitos." });
    }

    // Buscar al cliente por su ID
    const client = await Client.findById(clientId);
    if (!client) {
      console.log("El cliente no existe.");
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    // Actualizar la contraseña
    client.password = password;  // Asignar la nueva contraseña

    // Guardar al cliente para que el middleware de hashPassword se ejecute
    const updatedClient = await client.save(); 

    res.status(200).json({ message: "Contraseña configurada exitosamente." });
  } catch (error) {
    console.error(error);  // Para ver detalles del error
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};

// Cambiar contraseña de cliente
export const requestPasswordChange = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el cliente existe
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    // Generar un token
    const token = generateToken({ clientId: client._id });

    // Crear enlace para cambiar contraseña
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}&role=client`;

    // Enviar correo electrónico con el enlace
    await sendEmail({
      to: email,
      subject: "Cambio de contraseña",
      html: `
        <p>Hola ${client.fullName},</p>
        <p>Recibimos una solicitud para cambiar tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetPasswordLink}">Cambiar contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.status(200).json({ message: "Correo enviado para cambiar la contraseña." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
