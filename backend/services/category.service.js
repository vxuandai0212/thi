const { Category } = require('../models')
const { to, TE }    = require('../services/util.service');

let CategoryService = {}

CategoryService.add = async function(category_info) {
    [err, category] = await to(Category.create(category_info))
    if(err) TE('err save category');
    return category;
}

CategoryService.getMany = async function(opts) {
    let query = Category.find().populate('foods');
    if (opts.offset != '0') {
        query.setOptions({ skip : parseInt(opts.offset) });
    }
    if (opts.limit) {
        query.setOptions({ limit : parseInt(opts.limit) });
    }
    let promise = query.exec();
    [err, categories] = await to(promise);
    if(err) TE('err get category');

    let total = await to(Category.find().count());
    return {categories, total};
}

CategoryService.get = async function(slug) {
    [err, category] = await to(Category.findOne({ slug: slug }).populate('foods'))
    if(err) TE('err get category');
    return category;
}

CategoryService.edit = async function(id, new_data) {
    [err, category] = await to(Category.findByIdAndUpdate(id, new_data, {new: true}))
    if(err) TE('err update category');
    return category;
}

CategoryService.delete = async function(id) {
    [err, category] = await to(Category.find({ _id:id }).remove().exec())
    if(err) TE('err delete category');
    return category;
}

module.exports.CategoryService = CategoryService

