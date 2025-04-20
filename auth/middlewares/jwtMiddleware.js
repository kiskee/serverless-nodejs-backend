// middlewares/jwtMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(event) {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // puedes usarlo luego en la función
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}

module.exports = verifyToken;
