const express = require('express')
const { Register, login, addMedia, updateMedia, deleteMedia, passwordRecovery, passwordChange, addComment, displayComment, showMedia, deleteComment } = require('../Controller/renoController')
const multer = require('multer')
const routerAdmin = express.Router()
const routerMedia = express.Router()
const routerComment = express.Router()
const routerPlaco = express.Router()
const routerPeinture = express.Router()
const jwt = require('jsonwebtoken')

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, '../public/medias')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }  
})

const authRoute = (req, res, next) =>{
    const token = req.authorization.token
    if(!token) return res.send("you have to provide a token.")

    try{ 
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
    }
    catch(error){
        res.send(`invalid token. ${error}`)
    }
}

const upload = multer({storage:storage})

routerAdmin.post('/register', upload.single('media'), Register)
routerAdmin.post('/login', login)
routerAdmin.post('/passwordRecovery',passwordRecovery)
routerAdmin.post('/passwordChange', passwordChange)

routerMedia.post('/add',authRoute, upload.single('media') ,addMedia)
routerMedia.put('/update/:id',authRoute, upload.single('media'), updateMedia)
routerMedia.delete('/delete/:id', authRoute,  deleteMedia)
routerMedia.get('/show',  showMedia)

routerComment.post('/add', addComment)
routerComment.delete('/delete/:id', authRoute, deleteComment )
routerMedia.get('/display', displayComment)

routerPlaco.post('/generate', authRoute)

routerPeinture.post('/generate', authRoute, )

module.exports = {routerAdmin, routerMedia, routerComment, routerPlaco}

