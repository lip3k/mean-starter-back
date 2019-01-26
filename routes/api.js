var express = require('express');
var router = express.Router();

router.get('/ping', function(req, res, next) {
    setTimeout(() => {
        res.send({status: 'OK'});
    }, 1);
});

module.exports = router;