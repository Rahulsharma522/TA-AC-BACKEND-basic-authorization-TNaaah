var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  let user = req.user;
  console.log(req.session);
  if (req.session.isAdmin === 'true') {
    return res.render('adminHome', { user });
  } else if (req.session.isAdmin === 'false') {
    return res.render('clientHome', { user });
  } else {
      
    return res.redirect('/users/userLogin');
  }
});
module.exports = router;
