const { Post } = require('../models')
const { to, TE }    = require('../services/util.service');
const { capitalize } = require('../helpers/capitalize')

let PostService = {}

PostService.add = async function(post_info) {
    [err, post] = await to(Post.create(post_info))
    if(err) TE('err save post');
    return post;
}

PostService.getMany = async function(opts) {
    let conditions = {};
    if (opts.category) {
        conditions.category = capitalize(opts.category)
    }
    if (opts.tag) {
        conditions.tags = { '$regex' : opts.tag, '$options' : 'i' }
    }
    let query = Post.find(conditions);
    if (opts.offset != '0') {
        query.setOptions({ skip : parseInt(opts.offset) });
    }
    if (opts.limit) {
        query.setOptions({ limit : parseInt(opts.limit) });
    }
    let promise = query.exec();
    [err, posts] = await to(promise);
    if(err) TE('err get post');

    let total = await to(Post.find(conditions).count());
    return {posts, total};
}

PostService.get = async function(slug) {
    [err, post] = await to(Post.findOne({ slug: slug }))
    if(err) TE('err get post');
    return post;
}

PostService.edit = async function(id, new_data) {
    [err, post] = await to(Post.findByIdAndUpdate(id, new_data, {new: true}))
    if(err) TE('err update post');
    return post;
}

PostService.delete = async function(id) {
    [err, post] = await to(Post.find({ _id:id }).remove().exec())
    if(err) TE('err delete post');
    return post;
}

module.exports.PostService = PostService

