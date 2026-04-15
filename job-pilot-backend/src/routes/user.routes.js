const express = require('express');
const { updateCompanyProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const multer = require('multer');

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.patch('/update-company', verifyToken, upload.single('logo'), updateCompanyProfile);

module.exports = router;
