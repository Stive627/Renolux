const nodemailer = require('nodemailer')

module.exports = function tmail(email, password, destEmail, subject, html){ 

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:email,
        pass:password
    }
})

var mailOptions = {
    from:email, 
    to: destEmail,
    subject:subject,
    html:html
}

return transporter.sendMail(mailOptions)
}