var express = require('express');
var router = express.Router();
var indexCtrl = require('../controller/index.controller')

router.get('/', indexCtrl.home);
router.get('/change-info', indexCtrl.changeInfo);
router.get('/change-pass', indexCtrl.changePass);


module.exports = router;
