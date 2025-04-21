const serverlessExpress = require("serverless-express/handler");
const express = require("serverless-express/express");
const UserService = require("./services/userService");
const CreateUserDto = require("./dtos/CreateUserDto");
const jwtMiddleware = require("../middlewares/jwtMiddlewareExpress");
const createUserSchema = require("../schemas/createUserSchema");

const userService = new UserService();
const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false, // para mostrar todos los errores juntos
    });

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const userDto = new CreateUserDto(value); // ya validado
    const result = await userService.createUser(userDto);

    if (result.error) {
      return res.status(result.statusCode || 400).json(result);
    }

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: result.user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "No se pudo crear el usuario",
      error: error.message,
    });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
});

app.get("/users", jwtMiddleware, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({
      message: "Error al listar usuarios",
      error: error.message,
    });
  }
});

app.get("/users/email/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado con ese email",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error finding user by email:", error);
    return res.status(500).json({
      message: "Error al buscar usuario por email",
      error: error.message,
    });
  }
});

app.put("/users/:id", jwtMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    const result = await userService.updateUser(userId, data);

    if (result.error) {
      return res.status(result.statusCode || 400).json(result);
    }

    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user: result.user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
});

app.delete("/users/:id", jwtMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await userService.deleteUser(userId);

    if (result.error) {
      return res.status(result.statusCode || 400).json(result);
    }

    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
});

module.exports.handler = serverlessExpress(app);
