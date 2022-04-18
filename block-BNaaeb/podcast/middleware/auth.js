var User = require('../models/User');

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, 'name email isAdmin', (err, user) => {
        if (err) return err;
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      user.locals.user = null;
      next();
    }
  },
};