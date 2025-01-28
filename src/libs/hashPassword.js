import bcrypt from "bcryptjs";

// Middleware para hashear contraseñas
export const hashPassword = async function (next) {
  try {
    // Verificar si la contraseña fue modificada
    if (!this.isModified("password")) {
      return next();
    }

    // Generar el hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
};
