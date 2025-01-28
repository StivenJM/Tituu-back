import mongoose from "mongoose";
import { hashPassword } from "../libs/hashPassword.js";

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  homeAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: false }, // Opcional para crear el administrador sin contraseña inicial
  isEnabled: { type: Boolean, default: true }, // Cuenta habilitada o no
  lastLogin: { type: Date, default: Date.now }, // Última fecha de inicio de sesión
  failedAttempts: { type: Number, default: 0 }, // Intentos fallidos de inicio de sesión
  isLocked: { type: Boolean, default: false }, // Estado de bloqueo por intentos fallidos
  lockUntil: { type: Date, default: null }, // Tiempo hasta que se desbloquea la cuenta
});


// Usar el middleware del hash
AdminSchema.pre("save", hashPassword);

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
