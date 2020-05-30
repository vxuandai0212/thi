const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');

let CommentSchema = mongoose.Schema({
    name: {type:String},
    email: {type:String},
    content: {type:String},
    replies: [this]
}, {timestamps: true});


let Comment = module.exports = mongoose.model('Comment', CommentSchema);

