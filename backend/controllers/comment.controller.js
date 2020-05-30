const { CommentService } =  require('../services/comment.service')
const { to, ReE, ReS } = require('../services/util.service');

const add = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, comment;

    let parent_id = req.body.parent_id;
    let parent_type = req.body.parent_type;
    let comment_info = req.body.comment_info;

    [err, comment] = await to(CommentService.add(parent_id, parent_type, comment_info));
    if(err) return ReE(res, err, 422);

    return ReS(res,{comment:comment}, 201);
}
module.exports.add = add;

const getMany = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, comments;
    let opts = req.query;
    [err, comments] = await to(CommentService.getMany(opts));
    if(err){
        return ReE(res, err);
    }
    
    return ReS(res, {comments: comments});
}
module.exports.getMany = getMany;

const getReplies = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, replies;
    let opts = req.body;
    let parent_id = req.params.comment_id;
    [err, replies] = await to(CommentService.getReplies(parent_id, opts));
    if(err){
        return ReE(res, err);
    }

    return ReS(res, {replies: replies});
}
module.exports.getReplies = getReplies;

const get = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, comment, comment_id;
    comment_id = req.body.comment_id;
    [err, comment] = await to(CommentService.get(comment_id));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {comment:comment});
}
module.exports.get = get;

const update = async function(req, res){
    let err, comment;
    let new_comment = req.body.comment;

    [err, comment] = await to(CommentService.edit(new_comment));
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {comment:comment});
}
module.exports.update = update;

const remove = async function(req, res){
    let err, comment;
    let comment_id = req.body.comment_id;

    [err, comment] = await to(CommentService.delete(comment_id));
    if(err) return ReE(res, 'error occured trying to delete the comment');

    return ReS(res, {message:'Deleted Comment'}, 204);
}
module.exports.remove = remove;