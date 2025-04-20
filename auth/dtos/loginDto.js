class LoginDto {
    constructor(data) {
      this.email = data.email;
      this.password = data.password;
    }
  
    validate() {
      const errors = [];
  
      // Email validation
      if (!this.email || typeof this.email !== 'string') {
        errors.push('Email cannot be empty');
      } else if (this.email.length > 100) {
        errors.push('Email cannot exceed 100 characters');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        errors.push('Invalid email format');
      }
  
      // Password validation
      if (!this.password || typeof this.password !== 'string') {
        errors.push('Password cannot be empty');
      } else {
        if (this.password.length < 8) {
          errors.push('Password must be at least 8 characters long');
        } else if (this.password.length > 50) {
          errors.push('Password cannot exceed 50 characters');
        }
  
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(this.password)) {
          errors.push('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
      }
  
      return errors;
    }
  }
  
  module.exports = LoginDto;