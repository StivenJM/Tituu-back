import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

console.log("Token:"+process.env.SECRET_KEY);

// Generar un token
const SECRET_KEY = process.env.SECRET_KEY; // Clave secreta desde .env

console.log("secret antes: "+SECRET_KEY);

export const generateToken = (payload, expiresIn = "1h") => {  
  console.log("secret después: "+SECRET_KEY);
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verificar un token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    throw new Error("Token inválido o expirado.");
  }
};
