const nodemailer = require('nodemailer');

 const sendEmail= async options=>{
   

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c238fc4aa15164",
      pass: "9eea7adb61a71c"
    }
  });
   
  const mailOptions ={
    from :'bido<bidoala73@gmail.com>',
    to:options.email,
    subject:options.subject,
    text:options.message,
  }

  await transport.sendMail(mailOptions);
}
module.exports = sendEmail; 