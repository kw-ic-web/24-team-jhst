const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/deleteMember', adminController.deleteMember);
router.post('/updateMemberPoint', adminController.updateMemberPoint);
router.post('/addCharacter', adminController.addCharacter);
router.post('/addWord', adminController.addWord);

module.exports = router;
