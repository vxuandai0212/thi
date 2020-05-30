const { Post, Comment } = require('../models')
const { to, TE }    = require('../services/util.service');
const { PostService } =  require('../services/post.service')

let CommentService = {}

CommentService.add = async function(parent_id, parent_type, comment_info) {
    if (parent_type === "post") {
        try {
            let comment = await Comment.create(comment_info);
            let post = await PostService.edit(parent_id, { "$push": { "comments": comment._id } });
            return comment;
        } catch (error) {
            return TE('err save comment');
        }
    } else {
        try {
            let reply = await Comment.create(comment_info);
            let comment = await Comment.findByIdAndUpdate(parent_id, { "$push" : { "replies" : reply._id } });
            return reply;
        } catch(err) {
            return TE('err save reply');
        }
    }
}

CommentService.getMany = async function(opts) {
    let post_id = opts.post_id
    try {
        let post = await Post.findOne({_id: post_id}).populate('comments').select('comments')
        console.log(post.comment);
        return post.comments
        
    } catch (error) {
        TE('err get comments');
    }
}

CommentService.getReplies = async function(parent_id, opts) {
    try {
        let comment = await Comment.findOne({_id: parent_id}).populate('replies')
        return comment.replies
        
    } catch (error) {
        TE('err get comments');
    }
}

CommentService.get = async function(id) {
    [err, comment] = await to(Comment.findOne({ _id: id }))
    if(err) TE('err get comment');
    return comment;
}

CommentService.edit = async function(id, new_data) {
    [err, comment] = await to(Comment.findByIdAndUpdate(id, new_data, {new: true}))
    if(err) TE('err update comment');
    return comment;
}

CommentService.delete = async function(id) {
    [err, comment] = await to(Comment.find({ _id:id }).remove().exec())
    if(err) TE('err delete comment');
    return comment;
}

module.exports.CommentService = CommentService

