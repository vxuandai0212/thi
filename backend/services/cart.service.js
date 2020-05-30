const { Cart } = require('../models')
const { to, TE }    = require('../services/util.service');

let CartService = {}

CartService.add = async function(cart_info) {
    [err, cart] = await to(Cart.create(cart_info))
    if(err) TE('err save cart');
    return cart;
}

CartService.getMany = async function(opts) {
    let conditions = {}
    if (opts.user_id) {
        conditions.user = opts.user_id
    }
    let query = Cart.find(conditions).populate('orders.food');
    if (opts.offset != '0') {
        query.setOptions({ skip : parseInt(opts.offset) });
    }
    if (opts.limit) {
        query.setOptions({ limit : parseInt(opts.limit) });
    }
    let promise = query.exec();
    [err, carts] = await to(promise);
    if(err) TE('err get cart');

    let total = await to(Cart.find(conditions).count());
    return {carts, total};
}

CartService.get = async function(id) {
    [err, cart] = await to(Cart.findById(id).populate('orders.food'))
    console.log(cart);
    if(err) TE('err get cart');
    return cart;
}

CartService.edit = async function(id, new_data) {
    [err, cart] = await to(Cart.findByIdAndUpdate(id, new_data, {new: true}))
    if(err) TE('err update cart');
    return cart;
}

CartService.delete = async function(id) {
    [err, cart] = await to(Cart.find({ _id:id }).remove().exec())
    if(err) TE('err delete cart');
    return cart;
}

module.exports.CartService = CartService

