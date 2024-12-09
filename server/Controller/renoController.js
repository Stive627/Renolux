const tmail = require('../tools/tmail')
const bcrypt = require('bcrypt')
const {AdminModel, MediaModel, CommentModel, ImgdeoModel, PlacoModel, PeintureModel} = require('../db/RenoModel')
const jwt = require('jsonwebtoken')
const fs = require('node:fs')
const pdfDocument = require('pdfkit')
require('dotenv').config()

const Register = async(req, res) => {
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

const login = async (req, res) => {
    const {usernameoremail, password} = req.body
    if(!usernameoremail || !password) return res.send(`successfully logged, ${token}`)
    const user = await AdminModel.findOne({$or:[{username:usernameoremail}, {email:usernameoremail}]}).catch((error)=>res.status(400).send(error))
    if(!user) return res.status(400).send('Invalid credential')
    const goodPassowrd = await bcrypt.compare(password, user.password).catch((error)=>res.status(400).send(error))
    if(goodPassowrd){
        const token = jwt.sign({_id:user._id}, process.env.SECRET_KEY)
        return res.send(`successfully logged, ${token}`)   
    }
    res.send('invalid credentials.')
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

const addMedia = async(req, res) => {
    const {category} = req.body
    const file = req.file
    if(!req.body.category || !req.file) return res.send('There are the emplty fields.')
        try{ 
        const owner = await AdminModel.findOne({_id:req.user._id})
        const imgdeo = await ImgdeoModel.create({size:file.size, filename: file.filename, url:file.path})
        await imgdeo.save()
        const media = new MediaModel({owner:owner._id, category:category, contentType:imgdeo._id})
        await media.save()
        await ImgdeoModel.updateOne({filename:imgdeo.filename}, {media:media._id})
        await AdminModel.updateOne({_id:owner._id}, {medias:[...owner.medias, media._id]})
        res.send('The media is successfully added.')
        }
        catch(error){res.status(404).send(error)}
}

const updateMedia = async(req, res) => { 
    const file = req.file
    if(!req.body.category || !req.file) return res.send('The fields are missing')
    try{
    const media = await MediaModel.findOne({_id:req.params.id}) 
    const imgdeo = await ImgdeoModel.findOne({media:media._id})
    const updatedImgdeo = await ImgdeoModel.updateOne({media: media._id}, {size:file.size, filename:file.filename, url:file.path})
    await MediaModel.updateOne({_id:req.params.id}, {category:req.body.category, contentType:updatedImgdeo._id}).catch((err)=> res.status(400).send(err))
    if(imgdeo.filename !== file.filename){
        fs.rm(imgdeo.url, (err) =>{
            if(err) res.send(err)
        })
    }
    res.status(200).send('media updated')
    }
    catch(error){
        res.send(error)
    }    
}

const deleteMedia = async(req, res) => { 
    try{
    const media =  await MediaModel.findOneAndDelete({_id:req.params.id}).populate('contentType')
    await ImgdeoModel.findOneAndDelete({_id:media.contentType._id})
        fs.rm(media.contentType.url, (err) => {
            if(err) return res.send(err)
            res.send('The media is deleted')
        })
    }
    catch(error){res.status(400).send(`An error occured, ${error}`)}
}

const showMedia = async(req, res) => {
    try{ 
    const medias = await MediaModel.find().populate('owner').populate('contentType')
    res.status(200).send(medias)
    }
    catch(err){
        res.status(400).send(err)
    }

} 

const addComment = async(req, res) =>{
    const {firstname, email, message, stars} = req.body
    if(!firstname || !message || !stars || !email) return res.send('The are the missing fields.')
    const comment = new CommentModel(req.body)
    await comment.save()
    .then(()=>res.send('New comment'))
    .catch((error)=>res.send(`An error occured. ${error}`))
}

const deleteComment = async(req, res) =>{
    
    await CommentModel.findByIdAndDelete({_id:req.params.id})
    .then(()=>res.send('The comment is deleted'))
    .catch((error)=> res.send('An error occured', error))
    
}
const displayComment = async(req, res) =>{
    await CommentModel.find()
    .then((data) => res.send(data))
    .catch((err) => res.send(`An error occured , ${err}`))
}

const placoDevis = async(req, res) => {
    const {
        title, price, surface,
        vice_placo_qte, vice_placo_prix, bande_armee_qte,
        bande_armee_prix, bande_joint_qte, bande_joint_prix, 
        enduit_colle_qte, enduit_colle_prix,
        enduit_lissage_qte, enduit_lissage_prix,
        corniere_qte, corniere_prix, plaque_placo_qte, plaque_placo_prix,
        cheville_qte, cheville_prix, fourrure_qte, fourrure_prix,
        } 
        = req.body
    const [day, number, month, year] = new Intl.DateTimeFormat('fr-CM', {'dateStyle':'full'}).format(new Date()).split(' ')
    const num = number.length === 1 ? '0'+ number : number
    const randomDoc = Math.floor(Math.random()* 10000)
    const doc = new pdfDocument()
    doc.font('Times-Roman')
    doc.pipe(fs.createWriteStream('public/devis/placo' + String(randomDoc) + '.pdf'))
    doc.image('public/devis/logo_renolux_cameroun.png',15  , 10, {scale:0.55})
    doc.fontSize(18).text(day, 350, 60)
    doc.fontSize(18).text(', ' +  String(num) +  month, 395, 60,{underline:true})
    doc.fontSize(18).text(year, 495, 60)
    doc.font('Times-Bold').fontSize(18).text('Entreprise: ', 28, 152)
    doc.fontSize(16).font('Times-Roman').text('RENOLUX CAMEROON', 125, 154)
    doc.font('Times-Bold').fontSize(18).text('Localisation: ', 28, 177)
    doc.fontSize(16).font('Times-Roman').text('Yaounde, CAMEROON', 137, 179)
    doc.font('Times-Bold').fontSize(18).text('Tel : ', 28, 202)
    doc.fontSize(16).font('Times-Roman').text('+237 691098037', 77, 204)
    doc.font('Times-Bold').fontSize(18).text('Mail : ', 28, 227)
    doc.fontSize(16).font('Times-Roman').text('renolux3@gmail.com', 83, 227)
    doc.font('Times-Bold').fontSize(18).text('Site web : ', 28, 249)
    doc.fontSize(16).font('Times-Roman').text('https://renolux.netlify.app', 113, 249)

    doc.lineCap('')
        .roundedRect(15, 135, 300, 140, 12)
        .stroke()
    doc.moveDown(2)
    doc.font('Times-Bold').fontSize(21) .text(title, {underline:true, align:'center'})   
    doc.moveDown(2)

    doc.lineCap('')
        .rect(23, 336, 580, 30).stroke()
        doc.font('Times-Bold').fontSize(16).fillColor('black') 
        .text('Designation', 30, 341)
        doc.lineCap('')
        .rect(182, 336, 100, 30).stroke()
        doc.font('Times-Bold').fontSize(16).fillColor('black') 
        .text('Quantite', 185, 341)
        doc.font('Times-Bold').fontSize(16).fillColor('black') 
        .text('Prix unitaire (FCFA)', 284, 341)
        doc.lineCap('')
        .rect(440, 336, 163, 30).stroke()
        doc.font('Times-Bold').fontSize(16).fillColor('black') 
        .text('Prix total ', 445, 341).stroke()

        doc.lineCap('')
        .rect(23, 366, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('vices placo', 30, 371)
        doc.lineCap('')
        .rect(182, 366, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(vice_placo_qte, 185, 371)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(vice_placo_prix, 284, 371)
        doc.lineCap('')
        .rect(440, 366, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( vice_placo_prix * vice_placo_qte, 440, 371)
        
        doc.lineCap('')
        .rect(23, 396, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Bandes armées', 30, 401)
        doc.lineCap('')
        .rect(182, 396, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(bande_armee_qte, 185, 401)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(bande_armee_prix, 284, 401)
        doc.lineCap('')
        .rect(440, 396, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( bande_armee_prix * bande_armee_qte, 440, 401)

        doc.lineCap('')
        .rect(23, 426, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Bandes a joints', 30, 431)
        doc.lineCap('')
        .rect(182, 426, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(bande_joint_qte, 185, 431)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(bande_joint_prix, 284, 431)
        doc.lineCap('')
        .rect(440, 426, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( bande_joint_prix* bande_joint_qte, 440, 431)

        doc.lineCap('')
        .rect(23, 456, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Enduit colles', 30, 461)
        doc.lineCap('')
        .rect(182, 456, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(enduit_colle_qte, 185, 461)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(enduit_colle_prix, 284, 461)
        doc.lineCap('')
        .rect(440, 456, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( enduit_colle_prix * enduit_colle_qte, 440, 461)

        doc.lineCap('')
        .rect(23, 486, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Enduit de lissage', 30, 491)
        doc.lineCap('')
        .rect(182, 486, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(enduit_lissage_qte, 185, 491)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(enduit_lissage_prix, 284, 491)
        doc.lineCap('')
        .rect(440, 486, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( enduit_lissage_prix * enduit_lissage_qte, 440, 491)

        doc.lineCap('')
        .rect(23, 516, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Cornières', 30, 521)
        doc.lineCap('')
        .rect(182, 516, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(corniere_qte, 185, 521)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(corniere_prix, 284, 521)
        doc.lineCap('')
        .rect(440, 516, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( corniere_prix * corniere_qte, 440, 521)

        doc.lineCap('')
        .rect(23, 546, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Plaque de placoplâtre', 30, 551)
        doc.lineCap('')
        .rect(182, 546, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(plaque_placo_qte, 185, 551)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(plaque_placo_prix, 284, 551)
        doc.lineCap('')
        .rect(440, 546, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( plaque_placo_prix * plaque_placo_qte, 440, 551)

        doc.lineCap('')
        .rect(23, 576, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Chevilles', 30, 581)
        doc.lineCap('')
        .rect(182, 576, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(cheville_qte, 185, 581)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(cheville_prix, 284, 581)
        doc.lineCap('')
        .rect(440, 576, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( cheville_prix * cheville_qte, 440, 581)

        doc.lineCap('')
        .rect(23, 606, 580, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text('Fourrures', 30, 611)
        doc.lineCap('')
        .rect(182, 606, 100, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(fourrure_qte, 185, 611)
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text(fourrure_prix, 284, 611)
        doc.lineCap('')
        .rect(440, 606, 163, 30).stroke()
        doc.font('Times-Roman').fontSize(16).fillColor('black') 
        .text( fourrure_prix * fourrure_qte, 440, 611)

        doc.lineCap('')
        .rect(23, 636, 580, 30).stroke()
        doc.font('Times-Bold').fontSize(16).fillColor('black') 
        .text('Montant total des désignations', 30, 641, {align:'center'})

        doc.lineCap('')
        .rect(440, 636, 163, 30).stroke()
        doc.font('Times-Bold').fontSize(16).fillColor('black') 
        .text( (fourrure_prix * fourrure_qte) + 
        (cheville_prix * cheville_qte) + 
        (plaque_placo_prix * plaque_placo_qte) + 
        (corniere_prix * corniere_qte) + 
        (enduit_lissage_prix * enduit_lissage_qte) + 
        (enduit_colle_prix * enduit_colle_qte) + 
        (bande_joint_prix* bande_joint_qte) + 
        (bande_armee_prix * bande_armee_qte) + 
        (vice_placo_prix * vice_placo_qte)
        , 440, 641)
        doc.font('Times-Roman').text(`Le mètre carré de la main-d’œuvre sera facturé à raison de ${price}F/m2 ceci fait un montant total de ${(price * surface).toFixed(2)} FCFA  pour une superficie de  ${surface}m2.`, 18, 680)
    doc.end()
    const newPlacoDevis = new PlacoModel(req.body)
    await newPlacoDevis.save()
    .then(()=>res.status(200).send('The placo devis is generated'))
    .catch((err)=> res.status(400).send(`An error occured, ${err}`))
}

const peintureDevis = async(req, res) => {
    const {
        title, surface, pots_enduit_prix,
        pots_enduit_qte, pots_impression_prix,
        pots_impression_qte,
        sceau_peinture_prix, sceau_peinture_qte,
        sac_ciment_qte, sac_ciment_prix, price
        } 
        = req.body

    const [day, number, month, year] = new Intl.DateTimeFormat('fr-CM', {'dateStyle':'full'}).format(new Date()).split(' ')
    const num = number.length === 1 ? '0'+ number : number
    const randomDoc = Math.floor(Math.random()* 10000)
    const doc = new pdfDocument()
    doc.font('Times-Roman')
    doc.pipe(fs.createWriteStream('public/devis/placo' + String(randomDoc) + '.pdf'))
    doc.image('public/devis/logo_renolux_cameroun.png',15  , 10, {scale:0.55})
    doc.fontSize(18).text(day, 350, 60)
    doc.fontSize(18).text(', ' +  String(num) +  month, 395, 60,{underline:true})
    doc.fontSize(18).text(year, 495, 60)
    doc.font('Times-Bold').fontSize(18).text('Entreprise: ', 28, 152)
    doc.fontSize(16).font('Times-Roman').text('RENOLUX CAMEROON', 125, 154)
    doc.font('Times-Bold').fontSize(18).text('Localisation: ', 28, 177)
    doc.fontSize(16).font('Times-Roman').text('Yaounde, CAMEROON', 137, 179)
    doc.font('Times-Bold').fontSize(18).text('Tel : ', 28, 202)
    doc.fontSize(16).font('Times-Roman').text('+237 691098037', 77, 204)
    doc.font('Times-Bold').fontSize(18).text('Mail : ', 28, 227)
    doc.fontSize(16).font('Times-Roman').text('renolux3@gmail.com', 83, 227)
    doc.font('Times-Bold').fontSize(18).text('Site web : ', 28, 249)
    doc.fontSize(16).font('Times-Roman').text('https://renolux.netlify.app', 113, 249)

    doc.lineCap('')
        .roundedRect(15, 135, 300, 140, 12)
        .stroke()
    doc.moveDown(2)
    doc.font('Times-Bold').fontSize(21) .text(title, {underline:true, align:'center'})   
    doc.moveDown(2)
    doc.lineCap('')
    .rect(23, 336, 580, 30).stroke()
    doc.font('Times-Bold').fontSize(14).fillColor('black') 
    .text('Surface', 30, 341)
    doc.lineCap('')
    .rect(115, 336, 110, 30).stroke()
    doc.font('Times-Bold').fontSize(14).fillColor('black') 
    .text("Pots d'enduits", 120, 341)
    doc.font('Times-Bold').fontSize(14).fillColor('black') 
    .text("Pots d'impression", 228, 341)
    doc.lineCap('')
    .rect(345, 336, 120, 30).stroke()
    doc.font('Times-Bold').fontSize(14).fillColor('black') 
    .text("Pots de peinture", 354, 341).stroke()
    doc.font('Times-Bold').fontSize(14).fillColor('black') 
    .text("Ciment(sac)", 465, 341).stroke()
    doc.lineCap('')
    .rect(23, 366, 580, 30).stroke()
    doc.font('Times-Roman').fontSize(16).fillColor('black') 
    .text(surface, 30, 371)
    doc.lineCap('')
    .rect(115, 366, 110, 30).stroke()
    doc.font('Times-Roman').fontSize(16).fillColor('black') 
    .text(pots_enduit_qte, 120, 371)
    doc.font('Times-Roman').fontSize(16).fillColor('black') 
    .text(pots_impression_qte, 228, 371)
    doc.lineCap('')
    .rect(345, 366, 120, 30).stroke()
    doc.font('Times-Roman').fontSize(16).fillColor('black') 
    .text(sceau_peinture_qte, 364, 371)
    doc.font('Times-Bold').fontSize(14).fillColor('black') 
    .text(sac_ciment_qte, 475, 371).stroke()
    doc.font('Times-Roman').text(`Le mètre carré de la main-d’œuvre sera facturé à raison de ${price}F/m2 ce qui fait un total de ${(surface * price).toFixed(2)}FCFA.`, 18, 420)
   doc.end()
   const newDevisPeinture = new PeintureModel(req.body)
   await newDevisPeinture.save()
   .then(()=> res.status(200).send('The peinture devis is generated.'))
   .catch((reason)=>res.status(400).send(reason))
    
}

module.exports = {Register, login, addMedia, updateMedia, deleteMedia, passwordRecovery, passwordChange, addComment, deleteComment, displayComment, showMedia, placoDevis, peintureDevis}