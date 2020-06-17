const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');

let OrderDetail = mongoose.Schema({
    food: {type: mongoose.Schema.ObjectId, ref: 'Food'},
    quantity: {type: Number}
})

let CartSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    orders: [OrderDetail],
    status: {type: Number}
}, {timestamps: true});

CartSchema.methods.toWeb = function(){
    let json = this.toJSON({ virtuals: true });
    json.id = this._id;//this is for the front end
    return json;
};

let Cart = module.exports = mongoose.model('Cart', CartSchema);

