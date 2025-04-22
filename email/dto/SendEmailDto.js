class SendEmailDto {
    constructor(data) {
      this.recipients = data.recipients;
      this.subject = data.subject;
      this.template = data.template;
      this.context = data.context;
    }
  }
  
  module.exports = SendEmailDto;
  