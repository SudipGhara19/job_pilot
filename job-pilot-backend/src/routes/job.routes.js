const express = require('express');
const { createJob, getJobById, getMyJobs, updateJob, deleteJob } = require('../controllers/job.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', verifyToken, createJob);
router.get('/', verifyToken, getMyJobs);
router.get('/:id', verifyToken, getJobById);
router.put('/:id', verifyToken, updateJob);
router.delete('/:id', verifyToken, deleteJob);

module.exports = router;
