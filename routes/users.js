var express = require('express');
var router = express.Router();
var Model = require('../db');
var myUtil = require('../util');
/* GET users listing. */
router.get('/reg', myUtil.checkNotLogin,  function(req, res, next) {
  res.render('user/reg', { title: '注册' });
});
router.post('/reg', myUtil.checkNotLogin, function(req, res, next){
  var user = req.body;
  if(user.password != user.repassword){
    req.flash('error', '两次输入密码不一致');
    return res.redirect('/users/reg');
  }
  delete user.repassword;
  user.password = myUtil.md5(user.password);
  user.avatar = 'https://secure.gravatar.com/avatar/'+myUtil.md5(user.email)+'?s=48';
  new Model('User')(user).save(function(err, user){
    if(err){
      req.flash('error', '保存数据库出错');
      return res.redirect('/users/reg');
    }
    req.flash('success', '注册成功');
    req.session.user = user;
    res.redirect('/');
  });
});
router.get('/login', myUtil.checkNotLogin, function(req, res, next) {
  res.render('user/login', { title: '登录' });
});
router.post('/login', myUtil.checkNotLogin, function(req, res, next) {
  var user = req.body;
  user.password = myUtil.md5(user.password);
  Model('User').findOne(user, function(err, user){
    if(err){
      req.flash('error', '登录失败');
      return res.redirect('/users/login');
    }
    if(user){
      req.session.user = user;
      req.flash('success', '登录成功');
      res.redirect('/');
    }else {
      req.flash('error', '用户名或密码不正确');
      res.redirect('/users/login');
    }
  })
});
router.get('/logout', myUtil.checkLogin, function(req, res){
  req.session.user = null;
  return res.redirect('/users/login');
});
module.exports = router;
