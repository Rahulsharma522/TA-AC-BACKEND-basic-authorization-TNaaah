var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Podcast = require('../models/Podcast');
var auth = require('../middleware/auth');
var multer = require('multer');
var path = require('path');
const { get } = require('http');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/upload'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

//list
router.get('/', (req, res, next) => {
  console.log(req.session);

  if (req.user.isAdmin) {
    Podcast.find({}, (err, podcasts) => {
      if (err) return next(err);
      res.render('podcasts', { podcasts, user });
    });
  } else {
    Podcast.find({ isVerified: true }, (err, podcasts) => {
      if (err) return next(err);
      res.render('podcasts', { podcasts });
    });
  }
});
//add podcast

router.get('/new', auth.loggedInUser, (req, res) => {
  let user = req.user;
  res.render('addPodcast', { user });
});

router.post(
  '/new',
  auth.loggedInUser,
  upload.fields([{ name: 'image' }, { name: 'audio' }]),
  (res, req, next) => {
    req.body.image = req.files.image[0].filename;
    req.body.audio = req.files.audio[0].filename;
    if (req.user.isAdmin) {
      req.body.isVerified = true;
    }
    Podcast.create(req.body, (err, podcast) => {
      if (err) return next(err);
      res.redirect('/podcast/');
    });
  }
);

//single podcast

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Podcast.findById(id, (err, podcast) => {
    if (err) return next(err);
    res.render('singlePodcast', { podcast });
  });
});

module.exports = router;