import { comparePassword } from "../libs/hashUtils.js";
import Client from "../models/client.model.js"; // Modelo de cliente
import Operator from "../models/operator.model.js"; // Modelo de operador
import Admin from "../models/admin.model.js"; // Modelo de administrador
import { validarEmail } from "../libs/regexValidation.js";
import { generateToken } from "../libs/tokenManager.js";
//----------------------------bloqueo por contrasenia incorrecta--------------------

const MAX_ATTEMPTS = 5; // Máximo de intentos permitidos
//const LOCK_TIME = 30 * 60 * 1000; // Tiempo de bloqueo (30 minutos)
const LOCK_TIME =  60 * 1000; // Tiempo de bloqueo 1 minuto 

const isProduction = process.env.APP_ENV === 'production';

export const login = async (req, res) => {
  try {
    //validar email

    const { email, password } = req.body; // Recibimos solo el correo
    //console.log("Correo recibido:", email);
    //validar email
    if (!validarEmail(email)) {
      // Si el correo no es válido, lanzar un error genérico
      return res.status(400).json({ error: "La solicitud no es válida." });
    }


    //---------[1]VALIDA SI EL CORREO ESTA EN LA BASE DE DATOS----
    let user = null; // Variable para almacenar al usuario
    let role = ""; // Variable para almacenar el rol

    // Buscar en la tabla de clientes
    user = await Client.findOne({ email });
    if (user) {
      role = "cliente"; // Identificar el rol
    }

    // Si no es cliente, buscar en la tabla de operadores
    if (!user) {
      user = await Operator.findOne({ email });
      if (user) {
        role = "operador"; // Identificar el rol
      }
    }
    
    // Si no es operador, buscar en la tabla de administradores
    if (!user) {
      user = await Admin.findOne({ email });
      if (user) {
        role = "administrador"; // Identificar el rol
      }
    }
    // Si no se encuentra el usuario en ninguna tabla
    if (!user) {
      return res.status(404).json({ error: "Credenciales incorrectas." });
    }
    //--------------------[7]VERIFICA SI ESTA ACTIVA CON CORREO-------------
    if (role === "cliente") {
      // Verificar si la cuenta está activada por correo
      if (user.isActive !== undefined && !user.isActive) {
        return res.status(403).json({
          error: "La cuenta no está activada. Revisa tu correo electrónico para activarla.",
        });
      }}



//----------------------------[2] VERIFICAR INACTIVIDAD ---------
if (role === "operador" || role==="cliente") {
  // Verificar si la cuenta está deshabilitada por inactividad
  if (user.isEnabled !== undefined && !user.isEnabled) {

    return res.status(424).json({
      error: "Tu cuenta ha sido deshabilitada por inactividad. Contacta al administrador para reactivarla.",
    });
  }
}

    //---------------------------------------------------------------
  
//----------------------------BLOQUEO DE CUENTA POR CONTRASENIA INCORRECTA--------------------

//-----------------------[3] PRIMERO VERIFICA SI LA CUENTA ESTÁ BLOQUEADA 
if (user.isLocked) {
  if (user.lockUntil && Date.now() < user.lockUntil) {
    return res.status(423).json({
      error: "Tu cuenta ha sido bloqueada temporalmente. Intenta de nuevo más tarde o restablece tu contraseña."
    });
  } else {
    //------------------------[4] DESBLOQUEA LA CUENTA SI EL TIEMPO HA PASADO
    // Desbloquear la cuenta si el tiempo de bloqueo ha expirado
    user.isLocked = false;
    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();
  }
}
//------------------------------------------------------------------------------------
//-----------------------[5] VERIFICA QUE LA CONTRASEÑA SEA VÁLIDA
const passwordMatch = await comparePassword(password, user.password);
if (!passwordMatch) {
  //---------------------------- BLOQUEO POR CONTRASEÑA INCORRECTA --------------------

  // Incrementar los intentos fallidos
  user.failedAttempts = (user.failedAttempts || 0) + 1;

  if (user.failedAttempts >= MAX_ATTEMPTS) {
    user.isLocked = true;
    user.lockUntil = Date.now() + LOCK_TIME; // Registra la marca de tiempo hasta que la cuenta permanecerá bloqueada
    await user.save();

    return res.status(423).json({
      error: "Tu cuenta ha sido bloqueada temporalmente. Intenta de nuevo más tarde o restablece tu contraseña."
    });
  }
  
  // Guardar los cambios en caso de intento fallido
  await user.save();
  return res.status(401).json({ error: "Credenciales incorrectas." });
}

//----------------------------bloqueo por contrasenia incorrecta--------------------
//---------------------[6] SI INICIA SESIÓN, RESTABLECE LOS PARÁMETROS
// Restablecer los intentos fallidos en caso de inicio de sesión exitoso
user.failedAttempts = 0;
user.isLocked = false;
user.lockUntil = null;
user.lastLogin = new Date();
await user.save();

//------------------------------------------------------------------------------------
// Inicio de sesión exitoso
const token = generateToken({ id: user._id, email: user.email, role });
console.log(role);
return res
.cookie("access_token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'None' : 'Strict',
  domain: '.tituu.netlify.app',
  maxAge: 1000 * 60 * 60, // 1 hora de duración
})
.status(200)
.json({
  message: `Inicio de sesión exitoso. ${isProduction}`,
  token,
  userName: user.fullName || user.email,
  role,
  phoneNumber: user.phoneNumber || null,
  email: user.email || null, // Asegúrate de incluir el correo
});



  } catch (error) {
    //console.error("Error al buscar usuario:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

