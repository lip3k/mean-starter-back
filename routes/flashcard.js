var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');

require('../config/passport')(passport);
var Flashcard = require('../models/flashcard');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/get', function(req, res) {
  const token = getToken(req.headers);

  if (token) {
    try {
      const user = jwt.verify(token, process.env.SECRET);
      const id = user._id;

      Flashcard.find({
        user: id
      }, (err, cards) => {
        if (err) return res.status(500).send(err)

        return res.status(200).send({
          success: true,
          payload: cards
        });
      });

    } catch (e) {
      return res.status(403).send({
        success: false,
        msg: e.message
      });
    }
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

router.post('/create', function(req, res) {
  const token = getToken(req.headers);

  if (token) {
    try {
      const user = jwt.verify(token, process.env.SECRET);
      const id = user._id;

      const flashcard = Object.assign(new Flashcard, req.body.flashcard);
      flashcard.user = id;

      flashcard.save(function(err) {
        if (err) {
          return res.json({
            success: false,
            msg: err.message
          });
        }
        res.json({
          success: true,
          msg: 'Successful created new flashcard'
        });
      });

    } catch (e) {
      return res.status(403).send({
        success: false,
        msg: e.message
      });
    }
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

router.put('/update', function(req, res) {
  const token = getToken(req.headers);

  if (token) {
    try {
      //const user = jwt.verify(token, process.env.SECRET);
      //const id = user._id;

      const flashcard = Object.assign(new Flashcard, req.body.flashcard);
      console.log(flashcard._id);
      Flashcard.findByIdAndUpdate(
        flashcard._id,
        flashcard,
        function(err, card) {
          if (err) {
            return res.json({
              success: false,
              msg: err.message
            });
          }
          console.log(card);
          res.json({
            success: true,
            msg: 'Card updated'
          });
        });

    } catch (e) {
      return res.status(403).send({
        success: false,
        msg: e.message
      });
    }
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({
        success: false,
        msg: 'Authentication failed. User not found.'
      });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), process.env.SECRET, {
            expiresIn: '1h'
          });
          // return the information including token as JSON
          res.json({
            success: true,
            token: token
          });
        } else {
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          });
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
  } catch (e) {
    verified = false;
  }
  res.json({
    success: verified
  });
});

// protected add
router.post('/add', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    // create new resource
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

// protected get
router.get('/get', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    // return requested data
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

// parse token
getToken = function(headers) {
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
