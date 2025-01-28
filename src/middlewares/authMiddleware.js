import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Este middleware solo aumenta en req la informacion del usuario si se ha logeado
  const token = req.cookies.access_token;
  req.session = { user: null }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.session.user = data;
  } catch (error) {}

  next()
};
