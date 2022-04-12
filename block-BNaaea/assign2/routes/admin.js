var express = require('express');
var router = express.Router();
const { Model } = require('mongoose');
var Product = require('../models/Product');

router.get('/product/new', (req, res, next) => {
  let user = req.user;
  res.render('productForm', { user });
});

router.post('/product/new', (req, res, next) => {
  Product.create(req.body, (err, product) => {
    if (err) return next(err);
    res.redirect('/admin/product');
  });
});

router.get('/product', (res, req, next) => {
  Product.find({}, (err, product) => {
    let user = req.user;
    if (err) return next(err);
    res.render('allProduct', { products: product }, user);
  });
});

router.get('/:id', (res, req, next) => {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    let user = req.user;
    if (err) return next(err);
    res.render('singleProduct', { product: product }, user);
  });
});

//edit
router.get('/:id/edit', (res, req, next) => {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    let user = req.user;
    if (err) return next(err);
    res.render('updateProduct', { product: product }, user);
  });
});

router.post('/:id', (res, req, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, (err, product) => {
    if (err) return next(err);
    res.redirect('/admin/' + id);
  });
});

//delete
router.get('/:id', (res, req, next) => {
  var id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err);
    res.redirect('/admin/product');
  });
});

module.exports = router;