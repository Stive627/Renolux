require('dotenv').config()
const tmail = require('../tools/tmail')
const bcrypt = require('bcrypt')
const {AdminModel, MediaModel, CommentModel, ImgdeoModel} = require('../db/RenoModel')
const jwt = require('jsonwebtoken')

const   Register = async(req, res) =>{
    const {username, email, password} = req.body
    if(!username || !email || !password){
        res.send('The field(s) are missing.')
    }
    else{
        if(username.length < 4){
            res.send('The username should contains more than 4 characters.')
        }else{
            if(!/^[^@]+@gmail.com/.test(email) || /^[^@]+/.exec(email)[0].length < 8){
                res.send('The email is invalid')
            }
            else{
                if(password.length < 5 || !/\d/.test(password)) {
                    res.send('The password is not valid.')
                 }
                else { 
                  const cryptPass =  await bcrypt.hash(password, 5)
                  const newAdmin = new AdminModel({username:username, email:email, password:cryptPass})
                  await newAdmin.save()
                  tmail('renoluxcameroun@gmail.com', 'Stivearnaud3#', email, 'Nouveau admininstrateur Renolux', '<h1>Bienvenue l\'espace administrateur de renolux cameroun.</h1>')
                  .then((value) => {console.log(value.response); console.log(value.response)})
                  .catch((error) => console.log('An error occured while sending message', error))
                  res.send('New admin added.')
                 }  
            }
        }
    }
}

const login = async (req, res) => {
    const {usernameoremail, password} = req.body
    const user = await AdminModel.find({$or:[{username:usernameoremail}, {email:usernameoremail}]})
    if(user){
        const goodPassowrd = await bcrypt.compare(password, user.password)
        if(goodPassowrd){
            const token = jwt.sign({username:usernameoremail}, process.env.SECRET_KEY)
            res.send(`successfully logged, ${token}`)   
        }
        else{
            res.send('invalid credentials.')
        }
    }
    else{
        res.send('invalid credentials.')
    }
}

const passwordRecovery = async (req, res) =>{
    const {email} = req.body
    const code = Math.floor(Math.random()*(199999 - 100000) + 100000)
    await tmail('renoluxcameroun@gmail.com', 'Stivearnaud3#', email, 'Voici le code pour modifier ton mot de passe', `<p>${code}</p>`)
    .then((value)=>res.send({message:value.response, code:code}))

}

const passwordChange = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) return res.send('The values fields are missing.')
    await AdminModel.updateOne({email:req.body.email}, {password:password})
    .then(()=>res.send('Password successfully changed.'))
    .catch((reason)=>res.send(`An error occured. \nThe reason is ${reason}`)) 
}

const addMedia = async(req, res) => {
    const {category} = req.body
    if(!req.body || !req.file) return res.send('There are the emplty fields.')
    try{
        const owner = await AdminModel.findOne({_id:req.user._id})
        const imgdeo = await ImgdeoModel.create({size:reqfile.size, filename: req.file.filename, url:req.file.path})
        const media = new MediaModel({owner:owner._id, contentType:imgdeo._id, category:category})
        await media.save()
        res.send('The media is successfully added.')
    }
    catch(error){
        res.send({message:'An error occured', err:error})
    }
}

const updateMedia = async(req, res) => {
    if(!req.body || req.file) return res.send('The fields are missing')
    try{
    const media = await MediaModel.findOne({_id:req.params.id}) 
    await ImgdeoModel.updateOne({media: media.contentType}, {size:req.file.size, filename:req.file.filename, url:req.file.path})
    const updatedImgdeo = await ImgdeoModel.findOne({media:media.contentType})
    await MediaModel.updateOne({_id:req.params.id}, {category:req.body.category, contentType:updatedImgdeo._id})
    }
    catch(error){
        res.send('An error occured', error)
    }    
}

const deleteMedia = async(req, res) => { 
    await MediaModel.deleteOne({_id:req.params.id})
    .then(() => res.send('The value is deleted'))
    .catch((error) =>res.send(`An error occured, ${error}`))
}

const showMedia = async(req, res) => {
    try{ 
    const medias = await MediaModel.find().populate('owner').populate('contentType')
    res.send(medias)
    }
    catch(error){
        res.status.send('An error occured')
    }
}

const addComment = async(req, res) =>{
    const {firstname, message, stars} = req.body
    if(!firstname || !message || !stars) return res.send('The are the missing fields.')
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
    .catch((err) => res.send('An error occured ', err))
}

const placoDevis = async(req, res) =>{
    const {titre, sceau_peinture, pot_enduit, sacs_ciments, pot_impression, surface, price} = req.body
    
}
module.exports = {Register, login, addMedia, updateMedia, deleteMedia, passwordRecovery, passwordChange, addComment, deleteComment, displayComment, showMedia}