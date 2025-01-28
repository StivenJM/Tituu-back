import bcrypt from "bcrypt";

// Función para hashear contraseñas
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Error al hashear la contraseña");
  }
};

// Función para comparar contraseñas
export const comparePassword = async (candidatePassword, hashedPassword) => {
  console.log("si entra");
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    throw new Error("Error al comparar contraseñas");
  }
};
