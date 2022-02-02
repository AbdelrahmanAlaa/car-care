const nodemailer = require('nodemailer');

 function sendEmail(){
   
 const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c238fc4aa15164",
      pass: "9eea7adb61a71c"
    }
  });
}
exports.sendEmail = sendEmail;
