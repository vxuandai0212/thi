const { Category, Food } = require('../models')
const { to, TE }    = require('../services/util.service');
const { CategoryService } =  require('../services/category.service')

let FoodService = {}

FoodService.add = async function(parent_id, food_info) {
    try {
        let food = await Food.create(food_info);
        let category = await CategoryService.edit(parent_id, { "$push": { "foods": food._id } });
        return food;
    } catch (error) {
        return TE('err save food');
    }
}

FoodService.getMany = async function(opts) {
    console.log(opts);
    let conditions = {};
    if (opts.name) {
        conditions.name = { '$regex' : opts.name, '$options' : 'i' }
    }
    let query = Food.find(conditions);
    if (opts.offset != '0') {
        query.setOptions({ skip : parseInt(opts.offset) });
    }
    if (opts.limit) {
        query.setOptions({ limit : parseInt(opts.limit) });
    }
    let promise = query.exec();
    [err, foods] = await to(promise);
    if(err) TE('err get foods');

    let count = await to(Food.find(conditions).count());
    let total = count[1]
    return {foods, total};
}

FoodService.get = async function(id) {
    [err, food] = await to(Food.findOne({ _id: id }))
    if(err) TE('err get food');
    return food;
}

FoodService.edit = async function(id, new_data) {
    [err, food] = await to(Food.findByIdAndUpdate(id, new_data, {new: true}))
    if(err) TE('err update food');
    return food;
}

FoodService.delete = async function(id) {
    [err, food] = await to(Food.find({ _id:id }).remove().exec())
    if(err) TE('err delete food');
    return food;
}

module.exports.FoodService = FoodService

