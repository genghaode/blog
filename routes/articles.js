var express = require('express');
var router = express.Router();
var myUtil = require('../util');
var Model = require('../db');
var markdown = require('markdown').markdown;
var multer = require('multer');
var path = require('path');
var async = require('async');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, '../public/uploads');
  },
  filename: function(req, file, cb){
    cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1));
  }
});
var upload = multer({storage: storage});

/* GET home page. */
router.get('/add', myUtil.checkLogin, function(req, res, next) {
  res.render('article/add', { title: '添加文章', article: {} });
});
router.post('/add', myUtil.checkLogin, upload.single('img'), function(req, res, next) {
  if(req.file){
    req.body.img = path.join('/uploads', req.file.filename);
    console.log(1);
  }
  var _id = req.body._id;
  if(_id){
    var set = {title: req.body.title, content: req.body.cotent};
    if(req.file){
      set.img = req.body.img;
    }
    Model('Article').update({_id: _id}, {$set: set}, function(err, result){
      if(err){
        req.flash('error', '数据库修改失败');
        return res.redirect('back');
      }
      req.flash('success', '修改成功');
      res.redirect('/');
    })
  }else{
    req.body.user = req.session.user._id;
    delete req.body._id;
    new Model('Article')(req.body).save(function(err, article){
      if(err){
        req.flash('error', '保存数据库失败');
        return res.redirect('/articles/add');
      }
      req.flash('success', '发表成功');
      res.redirect('/');
    });
  }
});
router.get('/list/:pageNum/:pageSize', function(req, res, next){
  var pageNum = req.params.pageNum && req.params.pageNum>0?parseInt(req.params.pageNum):1;
  var pageSize = req.params.pageSize && req.params.pageSize>0?parseInt(req.params.pageSize):2;
  var query = {};
  var searchBtn = req.query.searchBtn;
  var keyword = req.query.keyword;
  if(keyword){
    req.session.keyword = keyword;
    query['title'] = new RegExp(req.session.keyword, 'i');
  }else {
    req.session.keyword = '';
  }

  console.log(query);
  Model('Article').count(query, function(err, count){
    Model('Article').find(query).sort({createAt: -1}).skip((pageNum -1)*pageSize).limit(pageSize).populate('user').exec(function(err, articles){
      if(articles){
        articles.forEach(function(article){
          if(article.content){
            article.content = markdown.toHTML(article.content);
          }
        });
      }
      res.render('index', {
        title: '主页',
        pageNum: pageNum,
        pageSize: pageSize,
        totalPage: Math.ceil(count/pageSize),
        articles: articles,
        keyword: req.session.keyword
      });
    });
  });
});
router.get('/detail/:_id', function(req, res, next) {
  async.parallel([function(cb){
    Model('Article').findOne({_id: req.params._id}).populate('user').populate('comments.user').exec(function(err, article){
      article.content = markdown.toHTML(article.content);
      cb(err, article);
    });
  }, function(cb){
    Model('Article').update({_id: req.params._id}, {$inc: {pv: 1}}, cb);
  }], function(err, result){
    if(err){
      req.flash('error', err);
      res.redirect('back');
    }
    res.render('article/detail', { title: '文章详情', article: result[0] });
  });

});

router.post('/comment', myUtil.checkLogin, function(req, res){
  var user = req.session.user;
  Model('Article').update({_id:req.body._id}, {$push: {comments: {user: user._id, content: req.body.content}}}, function(err, result){
    if(err){
      req.flash('error', '评论保存数据库出错');
      return res.redirect('back');
    }
    req.flash('success', '评论成功');
    res.redirect('back');
  })
});
router.get('/edit/:_id', myUtil.checkLogin, function(req, res){
  Model('Article').findOne({_id: req.params._id}, function(err, article){
    res.render('article/add', {title: '编辑文章', article: article});
  });
});
router.get('/delete/:_id', myUtil.checkLogin, function(req, res){
  Model('Article').remove({_id: req.params._id}, function(err, result){
    if(err){
      req.flash('error', '数据库删除失败');
      res.redirect('back');
    }
    req.flash('success', '删除成功');
    res.redirect('/');
  })
});
module.exports = router;
