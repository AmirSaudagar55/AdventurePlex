const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: "",  //use env EMAIL
            pass: ""  //use env with EMAILAPPPASSWORD
        }
    }
);

function sendmail(to, sub, msg){
    transporter.sendMail({
       to:to,
       subject:sub,
       html:msg
    })
} 

sendmail("xyz@gmail.com", "This is test email", "This is testing body of test email");