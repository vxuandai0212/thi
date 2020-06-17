const { slugify } = require('../helpers/slugify')
const { CategoryService } =  require('../services/category.service')
const { to, ReE, ReS } = require('../services/util.service')

const add = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, category;

    let category_info = {} 
    category_info.name = req.body.name;
    category_info.slug = slugify(category_info.name);
    category_info.image = req.body.image;

    [err, category] = await to(CategoryService.add(category_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{category:category.toWeb()}, 201);
}
module.exports.add = add;

const getMany = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, categories;
    let opts = req.body;
    [err, categories] = await to(CategoryService.getMany(opts));
    if(err){
        return ReE(res, err);
    }

    let categories_json = []
    for (let i in categories.categories){
        let category = categories.categories[i];
        categories_json.push(category.toWeb())
    }
    return ReS(res, {categories: categories_json, total: categories.total[1]});
}
module.exports.getMany = getMany;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, category, slug;
    slug = req.body.slug;
    [err, category] = await to(CategoryService.get(slug));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {category:category.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, category;
    let category_id = req.body.category_id
    let new_category = req.body.category;
 
    new_category.slug = slugify(new_category.name);

    [err, category] = await to(CategoryService.edit(category_id, new_category));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {category:category.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let err, category;
    category_id = req.params.category_id;

    [err, category] = await to(CategoryService.delete(category_id));
    if(err) return ReE(res, 'error occured trying to delete the category');

    return ReS(res, {message:'Deleted Category'}, 204);
}
module.exports.remove = remove;