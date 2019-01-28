var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var Flashcard = require('../models/flashcard');
require('../config/passport')(passport);


/**
 * Get all
 */
router.get('/', function (req, res) {

    const token = getToken(req.headers);
    if (!token) {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized.'
        });
    }

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
});


/**
 * Create new
 */
router.post('/', function (req, res) {

    const token = getToken(req.headers);
    if (!token) {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized.'
        });
    }

    try {
        const user = jwt.verify(token, process.env.SECRET);
        const id = user._id;

        const flashcard = Object.assign(new Flashcard, req.body.flashcard);
        flashcard.user = id;

        flashcard.save(function (err) {
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
});


/**
 * Delete with ID
 */
router.delete('/:flashcardID', function (req, res) {

    const token = getToken(req.headers);
    if (!token) {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized.'
        });
    }

    try {
        Flashcard.findOneAndDelete({_id: req.params.flashcardID}, (err) => {

            if (err) {
                return res.status(403).send({
                    success: false,
                    msg: 'Unauthorized.'
                });
            }

            res.json({
                success: true,
                msg: 'Card deleted'
            });

        });
    } catch (e) {
        return res.status(403).send({
            success: false,
            msg: e.message
        });
    }
});

/**
 * Update
 */
router.put('/', function (req, res) {

    const token = getToken(req.headers);
    if (!token) {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized.'
        });
    }

    try {
        const flashcard = Object.assign(new Flashcard, req.body.flashcard);

        Flashcard.findByIdAndUpdate(
            flashcard._id,
            flashcard,
            function (err, card) {
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
});

router.post('/verifyToken', function (req, res) {
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

// Protected routes examples
// router.post('/add', passport.authenticate('jwt', {
//   session: false
// }), function(req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     // create new resource
//   } else {
//     return res.status(403).send({
//       success: false,
//       msg: 'Unauthorized.'
//     });
//   }
// });
// router.delete('/delete/:flashcardID', passport.authenticate('jwt', {
//     session: false
// }), function(req, res) {
//
//     var token = getToken(req.headers);
//     console.log(req.params.flashcardID);
//     // if (token) {
//     //     // create new resource
//     // } else {
//     //     return res.status(403).send({
//     //         success: false,
//     //         msg: 'Unauthorized.'
//     //     });
//     // }
// });
// router.get('/get', passport.authenticate('jwt', {
//   session: false
// }), function(req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     // return requested data
//   } else {
//     return res.status(403).send({
//       success: false,
//       msg: 'Unauthorized.'
//     });
//   }
// });

module.exports = router;
