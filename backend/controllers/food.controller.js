const { FoodService } =  require('../services/food.service')
const { to, ReE, ReS } = require('../services/util.service');

const add = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, food;

    let category_id = req.body.category_id;
    let food_info = req.body.food_info;

    [err, food] = await to(FoodService.add(category_id, food_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{food:food}, 201);
}
module.exports.add = add;

const getMany = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, foods;
    let opts = req.body;
    [err, foods] = await to(FoodService.getMany(opts));
    if(err){
        return ReE(res, err);
    }
    
    return ReS(res, {foods: foods});
}
module.exports.getMany = getMany;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, food, food_id;
    food_id = req.body.food_id;
    [err, food] = await to(FoodService.get(food_id));
    console.log(food);
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {food:food});
}
module.exports.get = get;

const update = async function(req, res){
    let err, food;
    let id = req.body.food_id
    let new_food = req.body.food;

    [err, food] = await to(FoodService.edit(id, new_food));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {food:food});
}
module.exports.update = update;

const remove = async function(req, res){
    let err, food;
    food_id = req.params.food_id;

    [err, food] = await to(FoodService.delete(food_id));
    if(err) return ReE(res, 'error occured trying to delete the food');

    return ReS(res, {message:'Deleted Food'}, 204);
}
module.exports.remove = remove;