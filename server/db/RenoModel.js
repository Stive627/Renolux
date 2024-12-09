const mongoose = require('mongoose')
const {Schema} = mongoose

const AdminSchema = new Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true},
    password: {type:String, required:true},
    medias:[{type:Schema.Types.ObjectId, ref:'Media'}]
}, 
{timestamps:true})

const MediaSchema = new Schema({
    owner:{type : Schema.Types.ObjectId, ref:'Admin',  required:true},
    category:{type:String, required:true, enum:['Peinture', 'Placoplatre', 'Decoration_interieure']},
    contentType:{type: Schema.Types.ObjectId, ref:'Imgdeo'}
}, {timestamps:true})

const ImgdeoSchema = new Schema({
    media: {type:Schema.Types.ObjectId, ref:'Media'},
    size: Number,
    filename: String,
    url:String
},{timestamps:true})

const commentSchema = new Schema({
    firstname:{type:String, required:true},
    email:{type:String, required:true},
    message:{type:String, required:true},
    stars:{type:Number, required:true}
},{timestamps:true})

const PlacoSchema = new Schema({
    title:{type: String, required:true},
    price: {type:Number, required:true},
    surface: {type:Number, required:true},
    vice_placo_qte:{type:Number, required:true},
    vice_placo_prix: {type:Number, required:true},
    bande_armee_qte: {type:Number, required:true},
    bande_armee_prix:{type:Number, required:true},
    bande_joint_qte: {type:Number, required:true},
    bande_joint_prix:{type:Number, required:true},
    enduit_colle_qte:{type:Number, required:true},
    enduit_colle_prix: {type:Number, required:true},
    enduit_lissage_qte: {type:Number, required:true},
    enduit_lissage_prix:{type:Number, required:true},
    corniere_qte: {type:Number, required:true},
    corniere_prix:{type:Number, required:true},
    plaque_placo_qte: {type:Number, required:true},
    plaque_placo_prix: {type:Number, required:true},
    cheville_qte: {type:Number, required:true},
    cheville_prix:{type:Number, required:true},
    fourrure_qte: {type:Number, required:true},
    fourrure_prix:{type:Number, required:true},

},{timestamps:true})

const PeintureSchema = new Schema({
    title:{type: String, required:true},
    surface: {type:Number, required:true},
    price: {type:Number, required:true},
    sceau_peinture_qte: {type:Number, required:true},
    sceau_peinture_prix: {type:Number, required:true},
    pots_enduit_qte: {type:Number, required:true},
    pots_enduit_prix: {type:Number, required:true},
    sac_ciment_qte: {type:Number, required:true},
    sac_ciment_prix: {type:Number, required:true},
    pots_impression_qte: {type:Number, required:true},
    pots_impression_prix: {type:Number, required:true},
},{timestamps:true})

const AdminModel = mongoose.model('Admin', AdminSchema)
const MediaModel = mongoose.model('Media', MediaSchema)
const CommentModel = mongoose.model('Comment', commentSchema)
const ImgdeoModel = mongoose.model('Imgdeo', ImgdeoSchema)
const PlacoModel = mongoose.model('Placo', PlacoSchema)
const PeintureModel = mongoose.model('Peinture', PeintureSchema)
module.exports = {AdminModel, MediaModel, CommentModel, ImgdeoModel, PlacoModel, PeintureModel}
