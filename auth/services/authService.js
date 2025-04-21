const jwt = require("jsonwebtoken");
const UserRepository = require("../../users/repository/userRepository");
const UserService = require("../../users/services/userService");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.blacklistedTokens = new Set();
    this.userService = new UserService();
  }

  async login(data) {
    // Simulate user search (replace with your database logic)
    try {
      const user = await this.userRepository.findByEmail(data.email);

      if (Object.keys(user).length === 0 && user.constructor === Object) {
        throw new UnauthorizedException("Usuario o Contraseña invalidos");
      }

      // Validate password
      const isPasswordValid = await this.comparePasswords(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException("Usuario o Contraseña invalidos");
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          picture: user.picture,
          name: user.name,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async loginGoogle(data) {
    try {
      // 1. Validar que el email esté verificado por Google
      if (!data.email_verified) {
        throw new UnauthorizedException("Error al intentar entrar con Google");
      }
      let user = await this.userRepository.findByEmail(data.email);

      // 3. Si no existe, crear un nuevo usuario
      if (Object.keys(user).length < 1) {
        user = await this.userService.createUser(data);
      }
      console.log("user", user);
      if (user.sub !== data.sub) {
        throw new UnauthorizedException("Error al intentar entrar con Google");
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          picture: user.picture,
          name: user.name,
          modules: user.modules,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  logout(token) {
    // Agrega el token al blacklist para invalidarlo
    this.blacklistedTokens.add(token);
    return { message: "Logout successful" };
  }

  async renewToken(data) {
    // Implementación de la lógica de renovación de token
    // Aquí puedes usar tu lógica para renovar el token del usuario
    return { message: "Token renewed", data };
  }

  async resetPassword(token, newPassword) {
    // Implementación de la lógica de restablecimiento de contraseña
    // Aquí puedes usar tu lógica para restablecer la contraseña del usuario
    return { message: "Password reset successful" };
  }

  async forgotPassword(email) {
    // Implementación de la lógica de olvido de contraseña
    // Aquí puedes usar tu lógica para enviar un correo electrónico de restablecimiento de contraseña
    return { message: "Password reset email sent", email };
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "60m", // Token expira en 60 minutos
      }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d", // Token de refresco válido por 7 días
      }
    );
  }

  async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = AuthService;
