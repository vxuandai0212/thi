const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');

let CategorySchema = mongoose.Schema({
    name: {type:String},
    foods: [
        {type: mongoose.Schema.ObjectId, ref: 'Food'}
    ],
    slug: {type:String},
    image: {type: String}
}, {timestamps: true});



CategorySchema.methods.toWeb = function(){
    let json = this.toJSON({ virtuals: true });
    json.id = this._id;//this is for the front end
    return json;
};

CategorySchema.virtual('view_url').get(function () {
    return '/categories/'+this.slug;
});

let Category = module.exports = mongoose.model('Category', CategorySchema);

