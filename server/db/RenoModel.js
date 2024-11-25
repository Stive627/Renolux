const mongoose = require('mongoose')
const {Schema} = mongoose

const AdminSchema = new Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true},
    password: {type:String, required:true},
    medias:[{type:Schema.Types.ObjectId, ref:'Media'}]
}, {timestamps:true})

const MediaSchema = new Schema({
    owner:{type : Schema.Types.ObjectId, ref:'Admin',  required:true},
    category:{type:String, required:true, enum:['Peinture', 'Placoplatre', 'Decoration_interieure']},
    contentType:{type: Schema.Types.ObjectId, ref:'Imgdeo'}
}, {timestamps:true})

const ImgdeoSchema = new Schema({
    media: [{type:Schema.Types.ObjectId, ref:'Media'}],
    size: Number,
    filename: String,
    url:String
},{timestamps:true})

const commentSchema = new Schema({
    firstname:{type:String, required:true},
    message:{type:String, required:true},
    stars:{type:Number, required:true}
},{timestamps:true})

const PlacoSchema = new Schema({
    titre:{type: String, required:true},
    plaque_de_placo: Number,
    chevilles: Number,
    fourrures: Number,
    cornieres: Number,
    enduit_de_lissage: Number,
    enduit_colle: Number,
    bande_a_joint: Number,
    bande_armee: Number,
    vice_placo: Number,
    surface: Number,
    price: Number
},{timestamps:true})

const PeintureSchema = new Schema({
    titre:{type: String, required:true},
    sceau_peinture: Number,
    pot_enduit: Number,
    sacs_ciments: Number,
    pot_impression: Number,
    surface: Number,
    price: Number,
},{timestamps:true})
const AdminModel = mongoose.model('dmin', AdminSchema)
const MediaModel = mongoose.model('Media', MediaSchema)
const CommentModel = mongoose.model('Comment', commentSchema)
const ImgdeoModel = mongoose.model('Imgdeo', ImgdeoSchema)
const PlacoModel = mongoose.model('placo', PlacoSchema)
const PeintureModel = mongoose.model('peinture', PeintureSchema)
module.exports = {AdminModel, MediaModel, CommentModel, ImgdeoModel, PlacoModel, pei}
