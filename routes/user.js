var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');

require('../config/passport')(passport);
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res) {
  if (!req.body.user) {
      res.json({success: false, msg: 'Missing data!'});
    } else {
      const newUser = new User({
        name: req.body.user.name,
        email: req.body.user.email,
        password: req.body.user.password,
        emailConfirmed: false
      });

      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
});

router.post('/signin', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: '1h' });
          // return the information including token as JSON
          res.json({success: true, token: token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/verifyToken', function(req, res) {
  let verified;
  try {
    jwt.verify(req.body.token, process.env.SECRET);
    verified = true;
  } catch(e) {
    verified = false;
  }
  res.json({success: verified});
});

// protected add
router.post('/add', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    // create new resource
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

// protected get
router.get('/get', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    // return requested data
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

// parse token
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
