// middlewares/jwtMiddlewareExpress.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers?.Authorization || req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Puedes adjuntar la información decodificada al objeto 'req' para usarla en las rutas
    req.user = decoded;
    next(); // Llama al siguiente middleware o a la ruta
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = jwtMiddleware;