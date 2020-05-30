const express 		       = require('express');
const router 		       	 = express.Router();

const UserController 	   = require('../controllers/user.controller');
const PostController     = require('../controllers/post.controller');
const CommentController  = require('../controllers/comment.controller');
const FoodController     = require('../controllers/food.controller')
const CategoryController = require('../controllers/category.controller')
const CartController     = require('../controllers/cart.controller')

const passport      	   = require('passport');
const path               = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

router.post(    '/users',                UserController.create);                                                    // C
router.get(     '/users',                passport.authenticate('jwt', {session:false}), UserController.get);        // R
router.put(     '/users',                passport.authenticate('jwt', {session:false}), UserController.update);     // U
router.delete(  '/users',                passport.authenticate('jwt', {session:false}), UserController.remove);     // D
router.post(    '/users/login',          UserController.login);


router.post('/foods', passport.authenticate('jwt', {session:false}), FoodController.add)
router.post('/foods/get', FoodController.get)
router.post('/foods/get-many', FoodController.getMany)
router.put('/foods', passport.authenticate('jwt', {session:false}), FoodController.update)
router.delete('/foods/:food_id', passport.authenticate('jwt', {session:false}), FoodController.remove)


router.post('/categories', passport.authenticate('jwt', {session:false}), CategoryController.add)
router.post('/categories/get',  CategoryController.get)
router.post('/categories/get-many',  CategoryController.getMany)
router.put('/categories', passport.authenticate('jwt', {session:false}), CategoryController.update)
router.delete('/categories/:category_id', passport.authenticate('jwt', {session:false}), CategoryController.remove)


router.post('/carts', passport.authenticate('jwt', {session:false}), CartController.add)
router.post('/carts/get',  CartController.get)
router.post('/carts/get-many',  CartController.getMany)
router.put('/carts', passport.authenticate('jwt', {session:false}), CartController.update)
router.delete('/carts/:cart_id', passport.authenticate('jwt', {session:false}), CartController.remove)

module.exports = router;
