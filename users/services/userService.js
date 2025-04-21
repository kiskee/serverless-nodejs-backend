const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const UserRepository = require("../repository/userRepository");
const CreateUserDto = require("../dtos/CreateUserDto");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  
async createUser(userDto) {
  try {
    const existingUser = await this.userRepository.findByEmail(userDto.email);
    if (existingUser) {
      return {
        error: true,
        statusCode: 409,
        message: "Un usuario con este correo ya existe",
      };
    }

    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    let password = userDto.password;

    if (password !== '' && !userDto.email_verified) {
      password = await bcrypt.hash(password, 10);
      userDto.sub = password;
    } else {
      password = userDto.sub;
    }

    const newUser = {
      id: userId,
      email: userDto.email,
      email_verified: userDto.email_verified || false,
      family_name: userDto.family_name || '',
      given_name: userDto.given_name || '',
      name: userDto.name || '',
      picture: userDto.picture || process.env.DEFAULT_IMG,
      sub: userDto.sub,
      password: password,
      createdAt: timestamp,
      updatedAt: timestamp,
      role: 'user',
    };

    await this.userRepository.create(newUser);

    const userResponse = { ...newUser };
    delete userResponse.password;

    // Enviar correo de bienvenida
    // const emailData = {
    //   recipients: newUser.email,
    //   subject: 'Bienvenido a Formación Profesional de Entrenadores de Natación',
    //   template: 'welcome',
    //   context: {
    //     name: newUser.name,
    //   },
    // };

    // await emailService.sendEmail(emailData);

    return { user: userResponse };
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new Error(error.message);
    }
    if (error.code === 11000) {
      throw new Error('Existe algo mal en nuestra bd con tus datos. ¡Lo sentimos!');
    }
    throw error;
  }
}

  async getUserById(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) return null;

      // Don't return the password
      delete user.password;
      return user;
    } catch (error) {
      console.error("Service error getting user by ID:", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) return null;

      // Don't return the password
      delete user.password;
      return user;
    } catch (error) {
      console.error("Service error getting user by email:", error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      
      // Remove passwords from all users
      users.forEach(user => {
        delete user.password;
      });
      
      return users;
    } catch (error) {
      console.error("Service error getting all users:", error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        return {
          error: true,
          statusCode: 404,
          message: "Usuario no encontrado",
        };
      }

      // Validate update data
      const userDto = new CreateUserDto({
        ...existingUser,
        ...updateData,
      });

      const validationErrors = userDto.validate();
      if (validationErrors.length > 0) {
        return {
          error: true,
          statusCode: 400,
          message: "Validation failed",
          errors: validationErrors,
        };
      }

      // If email is being changed, check if it already exists
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.userRepository.findByEmail(updateData.email);
        if (emailExists) {
          return {
            error: true,
            statusCode: 409,
            message: "Un usuario con este correo ya existe",
          };
        }
      }

      // Hash password if provided
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      // Add updated timestamp
      updateData.updatedAt = new Date().getTime();

      // Update the user
      await this.userRepository.update(userId, updateData);

      // Get updated user
      const updatedUser = await this.userRepository.findById(userId);
      
      // Don't return the password
      delete updatedUser.password;

      return { user: updatedUser };
    } catch (error) {
      console.error("Service error updating user:", error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        return {
          error: true,
          statusCode: 404,
          message: "Usuario no encontrado",
        };
      }

      // Delete the user
      await this.userRepository.delete(userId);
      return { message: "Usuario eliminado exitosamente" };
    } catch (error) {
      console.error("Service error deleting user:", error);
      throw error;
    }
  }
}

module.exports = UserService;