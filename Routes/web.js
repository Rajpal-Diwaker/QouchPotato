'use strict';
var express = require('express'),
    app = express(),
    webbService = require('../Services/web'),
    userDAO = require('../DAO/userDAO'),
    md5   = require('md5'),
    session   = require('express-session'),
    cookieParser   = require('cookie-parser'),
    isLoggedIn = require('../Utilities/isLoggedIn'),
    config = require('../Utilities/config').config,
    router = express.Router();

var passport = require('./passport');
var mongoStore = require("mongo-store");

// including module to store session data in mysql...
var MySQLStore = require('express-mysql-session')(session);
var options = {
    host: config.DB_URL.host,
    port: 3306,
    user: config.DB_URL.user,
    password: config.DB_URL.password,
    database: config.DB_URL.database
};
var sessionStore = new MySQLStore(options);

// storing session data in mysql database...
router.use(session({
  secret: 's23esdfcretsdf23423texsdfsdfthsdfere',
  saveUninitialized: true,
  resave: true,
  store: sessionStore,
  name : 'JSESSION'
}));

/**
*Middleware
*/

router.use(passport.initialize());
router.use(passport.session());


// body-parser for retrieving form data
//app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: true }));


// route middleware to ensure user is logged in
/*function isLoggedIn(req, res, next) {
    if (req.isAuthenticated());
        return next();
    res.sendStatus(401);
}*/


/* Site first page. */
router.get('/', (req, res) => {
    var userData = {
      userId : "",
      userName : "",
    }
  res.render('index',userData);
});

// register page load...
router.get('/register',(req,res)=>{
  res.render('form', {
          title: "Register", //page title
          action: "/signup"//post action for the form
      });
})

// Code to register new user from web app/.....
/*router.post('/signup', (req,res)=>{
  webbService.signup(req.body,(data)=>{
      if(data.statusCode==200){
        res.end("200");
        //res.send(data);
      }
      else{
        res.end("400");
      }
    //res.send(data);
  })
})*/


// code to load login page...
router.get('/login', (req,res)=>{
    var userData = {
      userId : "",
      userName : "",
    }
  res.render('index',userData);
})


/* User forgot password. */
router.post('/forgotPassword', (req, res) => {
    webbService.forgotPassword(req.body, (data) => {
      console.log(data);
      if(data.statusCode==200){
        res.end("200");
        //res.send(data);
      }
      else{
        res.end("400");
      }
    });
});

/*router.post("/login", 
    passport.authenticate("local-login", { failureRedirect: "/"}),
    function (req, res) {
        res.redirect("/dashboard"); 
});
*/

router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        res.end("400"); //return;
        //return res.redirect('/login');
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
        res.end("200");
        //return res.status(302).redirect('/dashboard');

      });
    })(req, res, next);
  });


router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if(info){
      if(info.errMsg=="email already exists"){
        console.log('return loop of already exist');
        res.end("401"); return;
      }
      if(info.errMsg=="request failed. Please try again later."){
        res.end("402"); return;
      }
      }
      if (!user) {
        res.end("400"); //return;
        //return res.redirect('/login');
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
        res.end("200");
        //return res.status(302).redirect('/dashboard');

      });
    })(req, res, next);
  });


router.get('/order', (req, res) => {

  if(req.user){
   var userData = {
      userId : req.user.user_id,
      userName : req.user.first_name
    }
  } else {
    var userData = {
      userId : "",
      userName : "",
    }
  }
  res.render('order',userData);

  /*
  , {
          title: "Home Page", //page title
          action: "/order"//post action for the form
      }
  */
});

// code for dashboard....
router.get('/dashboard',isLoggedIn, (req,res) => {
  //app.locals.userData = req.user; 
   var userData = {
      userId : req.user.user_id,
      userName : req.user.first_name,
    }
    console.log(userData);

  res.render('index',userData);
})



// code for logout
router.get("/logout",function(req,res){
  req.logout();
  req.session.destroy();
  return res.redirect('/');
});



/*router.post('/login',function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res.status(409).render('pages/login', {errMsg: info.errMsg});
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          return next(err);
        }
        return res.redirect('/dashboard');
      });
    })(req, res, next);
  });*/

/*
router.post('/login',
  passport.authenticate('local',{successRedirect:'/dashboard',failureRedirect:'/login',failureFlash:true}),
  function(req, res) {
    res.redirect('/dashboard'); return;

  });
*/


module.exports = router;
