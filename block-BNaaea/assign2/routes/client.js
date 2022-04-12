let express = require('express');
let router = express.Router();
let Product = require('../models/Product');
let auth = require('../middleware/auth');

router.get('/product', (req, res, next) => {
  Product.find({}, (err, product) => {
    let user = req.user;
    console.log(err, product);
    if (err) return next(err);
    res.render('clientAllProducts', { products: product, user });
  });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  let user = req.user;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render('clientEachProduct', { products: product, user });
  });
});

router.use(auth.loggedInUser);

router.get('/:id/likes', auth.loggedInUser, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, product) => {
    if (err) return next(err);
    res.redirect('/client/' + id);
  });
});
router.get('/:id/dislikes', auth.loggedInUser, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, product) => {
    console.log(product);
    if (err) return next(err);
    res.redirect('/client/' + id);
  });
});
module.exports = router;