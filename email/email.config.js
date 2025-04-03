const nodemailer= require ('nodemailer')

const transporter = nodemailer.createTransport({
    host: "workhubwriters.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'admin@workhubwriters.com', // your cPanel email address
      pass: 'Change4gD!', // your cPanel email password
    },
  });
// async..await is not allowed in global scope, must use a wrapper
async function main() {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Farhan= require (Coding Day - Testing" <farhan@codingday.tech>', // sender address
    to: "yourreceiveremail1@gmail.com,yourreceiveremail2@domain.com", // list of receivers
    subject: "This is Coding Day Send Email Example", // Subject line
    text: "Coding Day?", // plain text body
    html: "<h1>Coding Day</h1>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}



module.exports = transporter