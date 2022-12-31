require('../models/database');
const passport = require('passport');
const bcrypt = require('bcrypt')
const Category = require('../models/category');
const Food = require('../models/food');
const User = require('../models/user');

// Get / homepage
exports.homePage = async (req, res) => {
    try {
        const limitNumber = 4;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Food.find({}).sort({ _id: -1 }).limit(limitNumber);
        const chinese = await Food.find({ 'category': 'Chinese' }).limit(limitNumber);
        const american = await Food.find({ 'category': 'American' }).limit(limitNumber);
        const indian = await Food.find({ 'category': 'Indian' }).limit(limitNumber);
        const mexican = await Food.find({ 'category': 'Mexican' }).limit(limitNumber);

        const food = { latest, chinese, american, indian, mexican };

        res.render('index', { title: 'Cooking Blog - Home', categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /cart 
exports.cart = async (req, res) => {
    res.render('./customers/cart');
}

// Get /login
exports.login = async (req, res) => {
    res.render('./authentication/login');
}

// Post /login
exports.loginPost = async (req, res, next) => {

    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        req.flash('error', 'All fields are required');
        return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.flash('error', info.message)
            return next(err)
        }

        if (!user) {
            req.flash('error', info.message)
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                req.flash('error', info.message)
                return next(err)
            }
            return res.redirect('/');
        })
    })(req, res, next);
}

// Get /register
exports.register = async (req, res) => {
    res.render('./authentication/register');
}

// Post /register
exports.registerPost = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate request
    if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
    }

    // Check if email exists
    User.exists({ email: email }, (err, result) => {
        if (result) {
            req.flash('error', 'Email already taken')
            req.flash('name', name)
            req.flash('email', email)
            return res.redirect('/register')
        }
    })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a user 
    const user = new User({
        name,
        email,
        password: hashedPassword
    })

    user.save().then((user) => {
        // Login
        return res.redirect('/')
    }).catch(err => {
        req.flash('error', 'Something went wrong')
        return res.redirect('/register')
    })
}

// Post /logout
exports.logout = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/')
    })
}

// Get /contact
exports.contact = async (req, res) => {
    res.render('contact', { title: 'Cooking Blog - Contact' });
}

// Post /search
exports.search = async (req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let food = await Food.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });

        // res.json(food);
        res.render('search', { title: 'Cooking Blog - Search', food });

    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /categories
exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categoreis', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /categories/:id
exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        // console.log(categoryId)
        const limitNumber = 20;
        const categoryById = await Food.find({ 'category': categoryId }).limit(limitNumber);
        // console.log(categoryById);
        res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /foods/:id
exports.exploreFood = async (req, res) => {
    try {
        let foodId = req.params.id;
        const food = await Food.findById(foodId);

        res.render('food', { title: 'Cooking Blog - Recipes', food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /explore-latest
exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;
        const food = await Food.find({}).sort({ _id: -1 }).limit(limitNumber);

        res.render('explore-latest', { title: 'Cooking Blog - Explore latest Recipes', food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /explore-random
exports.exploreRandom = async (req, res) => {
    try {
        let count = await Food.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        const food = await Food.findOne().skip(random).exec();

        res.render('explore-random', { title: 'Cooking Blog - Explore Random recipe', food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Get /submit-fooditem
exports.submitFooditem = async (req, res) => {
    try {
        res.render('submit-fooditem', { title: 'Cooking Blog - Submit Your Recipe' })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

// Post /submit-fooditem
exports.submitFooditemOnPost = async (req, res) => {

    const { name, description, ingredients, category } = req.body;

    // validate request
    if (!name || !description || !ingredients || !category) {
        req.flash('error', 'All fields are required');
        req.flash('name', name);
        req.flash('description', description);
        req.flash('ingredients', ingredients);
        req.flash('category', category);
        // req.flash('price', price);
        // req.flash('image', image);
        return res.redirect('/submit-fooditem');
    }

    // new food item
    const food_item = new Food({
        name,
        description,
        ingredients,
        category,
        image: req.file.filename
    })

    // save food item in the database
    food_item
        .save()
        .then(data => {
            return res.redirect('/submit-fooditem');
        })
        .catch(err => {
            // res.status(500).send({ message: err.message || "Some error occurred while creating a create operation" })
            req.flash('error', 'Something went wrong')
            return res.redirect('/submit-fooditem')
        })
}

// Post /update-cart
// exports.updateCart = async (req, res) => {
//     // let cart = {
//     //     items: {
//     //         foodId: { item: foodObject, qty: 0 }
//     //     },
//     //     totalQty: 0,
//     //     totalPrice: 0
//     // }

//     // for the first time creating cart
//     if (!req.session.cart) {
//         req.session.cart = {
//             items: {},
//             totalQty: 0,
//             totalPrice: 0
//         }
//     }
//     let cart = req.session.cart;
//     console.log(req.body);

//     // Check if item does not exist in cart
//     // if (!cart.items[req.body._id]) {
//     //     cart.items[req.body._id] = {
//     //         items: req.body,
//     //         qty: 1
//     //     }
//     //     cart.totalQty = cart.totalQty + 1;
//     //     cart.totalPrice = cart.totalPrice + req.body.price;
//     // } else {
//     //     cart.items[req.body._id].qty += 1;
//     //     cart.totalQty += 1;
//     //     cart.totalPrice += req.body.price;
//     // }

//     return res.json({ data: 'All ok'})
//     // return res.json({ totalQty: req.session.cart.totalQty })
// }




// async function insertRecipe() {
//     try {
//         await Food.insertMany([
//             {
//                 "name": "Samosa",
//                 "description": "A samosa is a fried or baked pastry with a savory filling, including ingredients such as spiced potatoes, onions, and peas. It may take different forms, including triangular, cone, or half-moon shapes, depending on the region.",
//                 "ingredients": [
//                     "2 cups cilantro, coarsely chopped",
//                     "1 cup mint leaves",
//                     "1/4 cup lemon juice, from about 1 large lemon",
//                     "4 to 5 cloves garlic",
//                     "1 to 1 1/2 jalapenos, chopped",
//                     "1 (1-inch) gingerroot, peeled and chopped",
//                     "1 1/2 teaspoons salt",
//                     "1 1/2 teaspoons cumin seeds"
//                 ],
//                 "category": "Indian",
//                 "image": "samosa.jpg",
//                 "price": 30
//             },
//             {
//                 "name": "Ven Pongal",
//                 "description": "Ven pongal is a traditional South Indian dish made with rice, split yellow mung dal, ghee, cumin, ginger, pepper and curry leaves. The word “Venn” means “white” in Tamil and “pongal” is a popular lentil rice dish.",
//                 "ingredients": [
//                     "1 tsp ghee / clarified butter",
//                     "1/2 cup rice(rinsed)",
//                     "1/2 cup moong dal(rinsed)",
//                     "4 cup water",
//                     "1/2 tsp salt"
//                 ],
//                 "category": "Indian",
//                 "image": "ven-pongal.jpg",
//                 "price": 50
//             }
//         ]);
//     } catch (error) {
//         console.log(error);
//     }
// }

// insertRecipe();