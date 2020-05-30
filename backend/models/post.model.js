const mongoose 			= require('mongoose');
const {TE, to}          = require('../services/util.service');

const { cloud_name, api_key, api_secret } = require('../config/config')
const cloudinary                          = require('cloudinary')
cloudinary.config({
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret 
})

let PostSchema = mongoose.Schema({
    title: {type:String},
    short_content: {type:String},
    content: {type:String},
    thumbnail: {type:String},
    category: {type:String},
    tags: {type:String},
    comments: [
        {type: mongoose.Schema.ObjectId, ref: 'Comment'}
    ],
    created_by: {type:String},
    slug: {type:String}
}, {timestamps: true});



PostSchema.methods.toWeb = function(){
    let json = this.toJSON({ virtuals: true });
    json.id = this._id;//this is for the front end
    return json;
};

PostSchema.virtual('comments_count').get(function () {
    return this.comments ? this.comments.length : 0;
});

PostSchema.virtual('square_thumbnail').get(function () {
    return cloudinary.url(this.thumbnail, { width: 100, height: 100, crop: "fill" });
});

PostSchema.virtual('full_width_thumbnail').get(function () {
    return cloudinary.url(this.thumbnail, {});
});

PostSchema.virtual('side_banner_thumbnail').get(function () {
    return cloudinary.url(this.thumbnail, { width: 315, height: 240, crop: "fill" });
});

PostSchema.virtual('LargestCardWithImage').get(function () {
    return cloudinary.url(this.thumbnail, { width: 555, height: 155, crop: "fill" });
});

//SmallCardWithBackground
PostSchema.virtual('SmallCardWithBackground').get(function () {
    return cloudinary.url(this.thumbnail, { width: 263, height: 178, crop: "fill" });
});

//SmallCardWithImage
PostSchema.virtual('SmallCardWithImage').get(function () {
    return cloudinary.url(this.thumbnail, { width: 263, height: 70, crop: "fill" });
});

PostSchema.virtual('view_url').get(function () {
    return '/articles/'+this.slug;
});

let Post = module.exports = mongoose.model('Post', PostSchema);

