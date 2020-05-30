const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');

let FoodSchema = mongoose.Schema({
    name: {type:String},
    description: {type:String},
    image: {type:String},
    price: {type:String},
    slug: {type:String}
}, {timestamps: true});



FoodSchema.methods.toWeb = function(){
    let json = this.toJSON({ virtuals: true });
    json.id = this._id;//this is for the front end
    return json;
};

FoodSchema.virtual('view_url').get(function () {
    return '/foods/'+this.slug;
});

let Food = module.exports = mongoose.model('Food', FoodSchema);

