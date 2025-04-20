class ResetPasswordDto {
    constructor(data) {
      this.token = data.token;
      this.newPassword = data.newPassword;
    }
  
    validate() {
      const errors = [];
  
      // Token: obligatorio y debe ser string no vacío
      if (
        !this.token ||
        typeof this.token !== "string" ||
        this.token.trim() === ""
      ) {
        errors.push("El token es obligatorio");
      }
  
      // newPassword: obligatorio, string no vacío, mínimo 8 caracteres
      if (
        !this.newPassword ||
        typeof this.newPassword !== "string" ||
        this.newPassword.trim() === ""
      ) {
        errors.push("La nueva contraseña es obligatoria");
      } else if (this.newPassword.length < 8) {
        errors.push("La nueva contraseña debe tener al menos 8 caracteres");
      }
  
      return errors;
    }
  }
  
  module.exports = ResetPasswordDto;
  