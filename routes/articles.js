var express = require('express');
var router = express.Router();
var myUtil = require('../util');
var Model = require('../db');
var markdown = require('markdown');
var multer = require('multer');
var path = require('path');

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
  if(searchBtn){
    req.session.keyword = keyword;
  }
  if(req.session.keyword){
    query['title'] = new RegExp(req.session.keyword, 'i');
  }
  Model('Article').count(query, function(err, count){
    Model('Article').find(query).sort({createAt: -1}).skip((pageNum -1)*pageSize).populate('user').exec(function(err, articles){
      if(articles){
        articles.forEach(function(article){
          if(article.content){
            //article.content = markdown.toHTML(article.content);
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
router.get('/detail', function(req, res, next) {
  res.render('article/detail', { title: '文章详情' });
});

module.exports = router;
