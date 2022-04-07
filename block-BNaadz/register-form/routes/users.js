var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */

// registration
router.get('/register/new', function (req, res, next) {
  res.render('register');
});

router.post('/register/new', (req, res, next) => {
  // console.log(req.body)
  User.create(req.body, (err, user) => {
    console.log(err, user);
    if (err) return next(err);
    res.redirect('/users/login');
  });
});

// Login route

router.get('/login', (req, res, next) => {
  console.log(req.session);
  var error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email and Password is Required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'User Details are incorrect');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Email and Password is Not Correct');
        return res.redirect('/users/login');
      } else {
        req.session.userId = user.id;
        return res.redirect('/articles/allarticles');
        console.log(req.session);
      }
    });
  });
});

// dashboard
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

// logout
router.get('/logout', (req, res, next) => {
  console.log(req.session);
  req.session.destroy();
  res.clearCookie('connect-sid');
  res.redirect('/users/login');
});

module.exports = router;