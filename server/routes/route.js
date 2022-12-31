const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const multer = require('multer');
// const fs = require('fs');
const guest = require('../middlewares/guest');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// for image
const storage = multer.diskStorage({
    destination : (req , file , callback) => {
        callback(null , './uploads');
    } , 
    //Add extension in img
    filename : (request , file , callback) => {
        callback(null , file.originalname)
    }
})
const upload = multer({
    storage : storage
}).single('image');

router.get('/', controller.homePage);
router.get('/cart', controller.cart);
router.get('/login', guest, controller.login);
router.post('/login', controller.loginPost);
router.get('/register', guest, controller.register);
router.post('/register', controller.registerPost);
router.post('/logout', controller.logout);
router.get('/contact', controller.contact);
router.post('/search', controller.search);
router.get('/categories', controller.exploreCategories);
router.get('/categories/:id', controller.exploreCategoriesById);
router.get('/foods/:id', controller.exploreFood);
router.get('/explore-latest', controller.exploreLatest);
router.get('/explore-random', controller.exploreRandom);
// router.post('/update-cart', controller.updateCart);

// Admin
router.get('/submit-fooditem', admin, controller.submitFooditem);
router.post('/submit-fooditem', upload, controller.submitFooditemOnPost);

module.exports = router;