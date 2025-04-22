const express = require("serverless-express/express");
const serverlessExpress = require("serverless-express/handler");

const AuthService = require("./services/authService");
const LoginDto = require("./dtos/loginDto");
const GoogleDto = require("./dtos/googleDto");
const ResetPasswordDto = require("./dtos/resetPasswordDto");
const loginSchema = require("../schemas/loginSchema");
const googleSchema = require("../schemas/googleSchema");
const resetPasswordSchema = require("../schemas/resetPasswordSchema");

const authService = new AuthService();
const app = express();

app.use(express.json());

app.post("/auth/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const validationErrors = error.details.map((err) => err.message);
    return res.status(400).json({
      message: "Validación fallida",
      errors: validationErrors,
    });
  }

  const dto = new LoginDto(value);

  try {
    const result = await authService.login(dto);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "Error interno",
      error: error.message,
    });
  }
});

app.post("/auth/login-google", async (req, res) => {
  const { error, value } = googleSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validación fallida",
      errors,
    });
  }

  const dto = new GoogleDto(value);

  try {
    const result = await authService.loginGoogle(dto);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en login-google:", error);
    return res.status(500).json({
      message: "Error interno",
      error: error.message,
    });
  }
});

app.post("/auth/logout", async (req, res) => {
  const token = req.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const result = await authService.logout(token);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en logout:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
});

app.post("/auth/renew-token", async (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token no proporcionado" });
  }

  try {
    const result = await authService.renewToken(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en renew-token:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
});

app.post("/auth/forgot-password/:email", async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email no proporcionado" });
  }

  try {
    const result = await authService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
});

app.post("/auth/reset-password", async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validación fallida",
      errors,
    });
  }

  const dto = new ResetPasswordDto(value);

  try {
    const result = await authService.resetPassword(dto.token, dto.newPassword);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en reset-password:", error);
    return res.status(500).json({
      message: "Error interno",
      error: error.message,
    });
  }
});

module.exports.handler = serverlessExpress(app);
