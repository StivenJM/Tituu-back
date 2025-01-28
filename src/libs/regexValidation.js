// Validar email
export function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Validar teléfono
export function validarTelefono(telefono) {
  // Si el número de teléfono está vacío o no está definido, la validación es exitosa
  if (!telefono) return true;
  // Validar formato si existe un número
  const regex = /^09\d{8}$/;
  return regex.test(telefono);
}

// Validar contraseña
export function validarContrasena(contrasena) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  return regex.test(contrasena);
}
