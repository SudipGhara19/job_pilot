const express = require('express');
const { updateCompanyProfile, deleteAccount } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const multer = require('multer');

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.patch('/update-company', verifyToken, upload.single('logo'), updateCompanyProfile);
router.delete('/delete-account', verifyToken, deleteAccount);

module.exports = router;
