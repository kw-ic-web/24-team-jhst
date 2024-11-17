const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/member', adminController.getAllMembers);
router.get('/member/:member_id', adminController.getMembersById);
router.post('/member', adminController.createMembers);
router.put('/member/:member_id', adminController.updateMembers);
router.delete('/member/:member_id', adminController.deleteMembers);

// Word CRUD 라우트
router.get('/word', adminController.getAllWords);
router.get('/word/:word_id', adminController.getWordsById);
router.post('/word', adminController.createWords);
router.put('/word/:word_id', adminController.updateWords);
router.delete('/word/:word_id', adminController.deleteWords);

module.exports = router;
