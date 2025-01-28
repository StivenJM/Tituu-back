import dotenv from 'dotenv';
import hcaptcha from 'hcaptcha';
import { generateToken } from './tokenManager.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config({path: '../.env'});

// Función para verificar el captcha y generar un token JWT si es exitoso
export const verifyCaptcha = async (token) => {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  console.log("");
  console.log("");
  console.log(process.env.HCAPTCHA_SECRET_KEY);
  console.log("");
  console.log("");

  if (!secret) {
    throw new Error('HCAPTCHA_SECRET_KEY no está definido en las variables de entorno.');
  }

  try {
    // Verificar el captcha con hcaptcha
    const response = await hcaptcha.verify(secret, token);
    console.log('Respuesta de hCaptcha:', response);

    console.log("");
  console.log("");
  console.log('Respuesta de hCaptcha:', response);
  console.log('¿El campo success está presente?', response.success);
    console.log("");
  console.log("");

    if (response.success) {
      console.log('hCaptcha verificado exitosamente');

      // Generar un token JWT válido por 10 minutos
      console.log("SECRET_KEY desde .env:", process.env.SECRET_KEY);
      const sessionToken = generateToken({ verified: true }, '10m');
      console.log("SECRET_KEY desde generateToken .env:", process.env.SECRET_KEY);
      console.log(sessionToken);
      return { success: true, sessionToken };
    }
    

    return { success: false, message: 'hCaptcha verification failed' };
  } catch (error) {
    console.error('Error verifying hCaptcha:', error.message);
    return { success: false, message: 'Error during hCaptcha verification' };
  }
};