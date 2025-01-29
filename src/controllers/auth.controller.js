import Client from "../models/client.model.js";

export const getData = async (req, res) => {
  // Esta funcion toma el token de login y envia la informacion almacenada en ese token

  const { user } = req.session;
  console.log('Usuario Get Data:', user);
  if (!user) return res.status(401).json({ error: 'Unauthorized access', user: null });

  // Se envia solo informacion importante
  const data = {
    id: user.id,
    email: user.email,
    role: user.role
  }
  return res.json({ error: null, user: data});
};

export const validateToken = async (req, res) => {
  // Validar un token con true o false

  // Datos provenientes del middleware
  const { user } = req.session;
  if (!user) return res.json({ valid: false });

  return res.json({ valid: true });
};


export const getUserData = async (req, res) => {
  const { user } = req.session; 
  console.log('Usuario UserData :', user);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  console.log('ID del usuario:', user.id);  // Verificamos si el ID está correctamente accesible

  try {
    // Buscar el usuario por su id en la base de datos
    const foundUser = await Client.findById(user.id);

    if (!foundUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver los datos del usuario
    return res.json({
      fullName: foundUser.fullName,
      email: foundUser.email,
      phoneNumber: foundUser.phoneNumber,
      homeAddress: foundUser.homeAddress,
      isActive: foundUser.isActive,
      lastLogin: foundUser.lastLogin
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
};

export const logout = (req, res) => {
  return res
  .clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Strict'
  })
  .json({ message: `Logged out successfully` });
}