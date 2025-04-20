class ForgotPasswordDto {
    constructor(data) {
      this.email = data.email;
    }
  
    validate() {
      const errors = [];
  
      // Email: obligatorio y debe ser string no vacío
      if (
        !this.email ||
        typeof this.email !== "string" ||
        this.email.trim() === ""
      ) {
        errors.push("El email es obligatorio");
      }
  
      return errors;
    }
  }
  
  module.exports = ForgotPasswordDto;
  