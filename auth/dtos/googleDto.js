class GoogleDto {
    constructor(data) {
      this.email = data.email;
      this.email_verified = data.email_verified;
      this.family_name = data.family_name;
      this.given_name = data.given_name;
      this.name = data.name;
      this.picture = data.picture;
      this.sub = data.sub;
    }
  
    validate() {
      const errors = [];
  
      // Email
      if (!this.email || !this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push("El correo electrónico proporcionado no es válido");
      }
  
      // email_verified
      if (this.email_verified === undefined || typeof this.email_verified !== "boolean") {
        errors.push("El email debe estar verificado");
      }
  
      // family_name (optional)
      if (this.family_name !== undefined && typeof this.family_name !== "string") {
        errors.push("family_name debe ser una cadena de texto");
      }
  
      // given_name (optional)
      if (this.given_name !== undefined && typeof this.given_name !== "string") {
        errors.push("given_name debe ser una cadena de texto");
      }
  
      // name
      if (!this.name || typeof this.name !== "string" || this.name.trim() === "") {
        errors.push("El nombre completo es obligatorio");
      }
  
      // picture (optional)
      if (this.picture !== undefined && typeof this.picture !== "string") {
        errors.push("picture debe ser una cadena de texto");
      }
  
      // sub
      if (!this.sub || typeof this.sub !== "string") {
        errors.push("sub es obligatorio y debe ser una cadena de texto");
      }
  
      return errors;
    }
  }
  
  module.exports = GoogleDto;
  