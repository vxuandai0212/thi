const { slugify } = require('../helpers/slugify')
const { PostService } =  require('../services/post.service')
const { to, ReE, ReS } = require('../services/util.service')
const { cloud_name, api_key, api_secret } = require('../config/config')
const cloudinary = require('cloudinary')
const uuidv4 = require('uuid/v4');

cloudinary.config({
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret 
})

const add = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, post;

    let post_info = req.body.post;
    let thumbnail = uuidv4();
    post_info.thumbnail = thumbnail;
    await cloudinary.v2.uploader.upload(
        req.body.image,
        {
            public_id: thumbnail
        },
        function(error, result) {
            console.log(result, error)
        }
    );
    post_info.slug = slugify(post_info.title);

    [err, post] = await to(PostService.add(post_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{post:post.toWeb()}, 201);
}
module.exports.add = add;

const getMany = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, posts;
    let opts = req.query;
    [err, posts] = await to(PostService.getMany(opts));
    if(err){
        return ReE(res, err);
    }

    let posts_json = []
    for (let i in posts.posts){
        let post = posts.posts[i];
        posts_json.push(post.toWeb())
    }
    return ReS(res, {posts: posts_json, total: posts.total[1]});
}
module.exports.getMany = getMany;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, post, slug;
    slug = req.params.slug;
    [err, post] = await to(PostService.get(slug));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {post:post.toWeb(), comments_count: post.comments_count});
}
module.exports.get = get;

const update = async function(req, res){
    let err, post;
    let post_id = req.params.post_id
    let new_post = req.body.post;
    let image = req.body.image;
    let thumbnail = uuidv4();
    let thumbnail_is_new = req.body.thumbnail_is_new;
    if (thumbnail_is_new) {
        await cloudinary.v2.uploader.upload(
            image,
            {
                public_id: thumbnail
            },
            function(error, result) {
                console.log(result, error)
            }
        );
        new_post.thumbnail = thumbnail;
    }
        
    new_post.slug = slugify(new_post.title);

    [err, post] = await to(PostService.edit(post_id, new_post));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {post:post.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let err, post;
    post_id = req.params.post_id;

    [err, post] = await to(PostService.delete(post_id));
    if(err) return ReE(res, 'error occured trying to delete the post');

    return ReS(res, {message:'Deleted Post'}, 204);
}
module.exports.remove = remove;