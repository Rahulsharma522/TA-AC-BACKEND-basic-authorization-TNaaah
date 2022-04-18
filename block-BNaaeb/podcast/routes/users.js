var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/User');

router.use('/userDashboard', (req, res, next) => {
  if (req.session && req.session.userId) {
    let userId = req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      res.render('userDashboard', { user });
    });
  } else {
    res.redirect('/users/login');
  }
});
router.use('/adminDashboard', (req, res, next) => {
  if (req.session && req.session.userId) {
    let userId = req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      res.render('adminDashboard', { user });
    });
  } else {
    res.redirect('/users/login');
  }
});

router.get('/register', (req, res, next) => {
  let user = req.user;
  res.render('register', { user });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
});

router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'email/ password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/login');
    }

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      if (user.isAdmin === true) {
        res.redirect('/users/adminDashboard');
      } else {
        res.redirect('/users/userDashboard');
      }
    });
  });
});
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;