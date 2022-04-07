var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var auth = require('../middlewares/auth');

// likes and dislikes

router.get('/:id/article/likes', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, articlelike) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

router.get('/:id/article/dislikes', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, articlelike) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

router.get('/new', auth.loggedInUser, (req, res, next) => {
  let user = req.user;
  res.render('articleform', { user: user });
});

router.post('/addarticle/new', auth.loggedInUser, (req, res, next) => {
  req.body.author = req.user.id;
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    console.log(err, article);
    res.redirect('/articles/allarticles');
  });
});

router.get('/allarticles', (req, res, next) => {
  console.log(req.user);
  let user = req.user;
  Article.find({}, (err, article) => {
    if (err) return next(err);
    res.render('allarticles', { articles: article, user: user });
  });
});

// each article
router.get('/:id', (req, res, next) => {
  let user = req.user;
  let id = req.params.id;
  let error = req.flash('error')[0];
  Article.findById(id)
    .populate('comments')
    .exec((err, eacharticle) => {
      if (err) return next(err);
      res.render('eachArticle', { eacharticle, user: user, error });
    });
});

router.use(auth.loggedInUser);

router.get('/:id/article/edit', (req, res, next) => {
  let id = req.params.id;
  let currentUserId = req.user.id;
  let user = req.user;
  Article.findById(id, (err, editarticle) => {
    if (err) return next(err);
    if (currentUserId != editarticle.author.toString()) {
      req.flash('error', 'You are not authorized to this article');
      res.redirect('/articles/' + id);
    } else {
      res.render('articleEdit', { editarticle, user });
    }
  });
});

router.post('/:id/article/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, updatearticle) => {
    if (err) return next(err);
    if (currentUserId != editarticle.author.toString()) {
      req.flash('error', 'You are not authorized to this article');
      res.redirect('/articles/' + id);
    } else {
      res.render('articleEdit', { editarticle, user });
    }
  });
});

router.get('/:id/article/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndRemove(id, (err, deletearticle) => {
    if (err) return next(err);
    res.redirect('/articles/allarticles');
  });
});

// add comments
router.post('/:id/comments/new', (req, res, next) => {
  let id = req.params.id;
  let data = req.body;
  data.articleId = id;
  Comment.create(data, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment.id } },
      (err, updatearticle) => {
        if (err) return next(err);
        res.redirect('/articles/' + id);
      }
    );
  });
});

module.exports = router;