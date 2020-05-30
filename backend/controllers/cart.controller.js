const { CartService } =  require('../services/cart.service')
const { to, ReE, ReS } = require('../services/util.service')

const add = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, cart;

    let cart_info = req.body.cart;

    [err, cart] = await to(CartService.add(cart_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{cart:cart.toWeb()}, 201);
}
module.exports.add = add;

const getMany = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, carts;
    let opts = req.body;
    [err, carts] = await to(CartService.getMany(opts));
    if(err){
        return ReE(res, err);
    }

    let carts_json = []
    for (let i in carts.carts){
        let cart = carts.carts[i];
        carts_json.push(cart.toWeb())
    }
    return ReS(res, {carts: carts_json, total: carts.total[1]});
}
module.exports.getMany = getMany;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, cart, cart_id;
    cart_id = req.body.cart_id;
    [err, cart] = await to(CartService.get(cart_id));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {cart:cart.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, cart;
    let cart_id = req.body.cart_id
    let new_cart = req.body.cart;

    [err, cart] = await to(CartService.edit(cart_id, new_cart));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {cart:cart.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let err, cart;
    cart_id = req.params.cart_id;

    [err, cart] = await to(CartService.delete(cart_id));
    if(err) return ReE(res, 'error occured trying to delete the cart');

    return ReS(res, {message:'Deleted Cart'}, 204);
}
module.exports.remove = remove;