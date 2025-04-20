// middlewares/jwtAuth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rutas con JWT
 */
function jwtAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);

    // Adjuntar el usuario decodificado al request
    req.user = payload;

    next(); // continuar hacia el controlador
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Extrae el token del encabezado Authorization
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader) return undefined;
  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' ? token : undefined;
}

module.exports = jwtAuthMiddleware;
