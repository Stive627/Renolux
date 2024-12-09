const nodemailer = require('nodemailer')

const tmail = (email, password, destEmail, subject, html) =>{ 

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


const Register = async(req, res) =>{
    const {username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).send('The field(s) are missing.')
    }
    if(username.length < 4){
        return res.status(400).send('The username should contains more than 4 characters.')
    }
    if(!/^[^@]+@gmail.com/.test(email) || /^[^@]+/.exec(email)[0].length < 8){
        return res.status(400).send('The email is invalid')
    }
    if(password.length < 5 || !/\d/.test(password)) {
        return res.status(400).send('The password is not valid.')
    }
    const user = await AdminModel.findOne({$or:[{username:username}, {email:email}]})
    if(user){
        return res.status(400).send('The user already exist.')
    }
    const cryptPass =  await bcrypt.hash(password, 5)
    const newAdmin = new AdminModel({username:username, email:email, password:cryptPass})
    await newAdmin.save()
    .catch((error)=>res.status(400).send(error))
    await tmail('renoluxcameroun@gmail.com', 'ratdafwbjdqbilpt', email, 'Nouveau admininstrateur Renolux', "<h1 style='color:'blue'>Bienvenue dans l\'espace administrateur de renolux cameroun.</h1>")
    .then((value) => {console.log(value.response); res.status(200).send(value.response)})
    .catch((error) => console.log('An error occured while sending message', error))
}

const passwordRecovery = async (req, res) =>{
    const {email} = req.body
    const code = Math.floor(Math.random()*(199999 - 100000) + 100000)
    const codeString = String(code).slice(0, 3) + ' ' + String(code).slice(3)
    await tmail('renoluxcameroun@gmail.com', 'ratdafwbjdqbilpt', email, 'Voici le code pour modifier ton mot de passe', `<h2>Votre code de verification </h2><h1>${codeString}</h1>`)
    .then((value)=>res.send({message:value.response, code:code}))
    .catch((error)=>res.status(400).send(error))

}

const passwordChange = async (req, res) => {
    const {email, password} = req.body
    const cryptPass =  await bcrypt.hash(password, 5)
    if(!email || !password) return res.send('The values fields are missing.')
    await AdminModel.updateOne({email:req.body.email}, {password:cryptPass})
    .then(()=>res.send('Password successfully changed.'))
    .catch((reason)=>res.send(`An error occured. \nThe reason is ${reason}`)) 
}