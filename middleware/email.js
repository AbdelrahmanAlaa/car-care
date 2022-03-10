const mailjet = require ('node-mailjet')
.connect('99531965ae340588d8a42067c994078a', '9b10105a4486299154935a9fa8275a3f')

 const sendEmail = async options=>{
  const request =mailjet.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "bidoala73@gmail.com",
        "Name": "CarCare"
      },
      "To": [
        {
          email: options.email ,
          "Name": "for me "
        }
      ],
      subject: options.subject,
      "HTMLPart": options.status,
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
     
    // console.log(result.body)
  })
  .catch((err) => {
    // console.log(err.statusCode)
  })
}
  module.exports=sendEmail;


//  const sendEmail= async options=>{
//   var transport = nodemailer.createTransport({
//    host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
   
//   const mailOptions ={
//     from :'bido<bidoala73@gmail.com>',
//     to:options.email,
//     subject:options.subject,
   
//   }

//   await tras.sendMail(mailOptions);
// }
// module.exports = sendEmail; 