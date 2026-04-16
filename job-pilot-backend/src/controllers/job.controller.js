const Job = require('../models/job.model');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
  try {
    const newJob = new Job({
      ...req.body,
      employer: req.user.id, // Enforced by verifyToken middleware mapping
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    if (error.name === 'CastError') {
       return res.status(404).json({ message: 'Job not found' });
    }
    next(error);
  }
};

// @desc    Get all jobs for logged-in employer
// @route   GET /api/jobs
// @access  Private
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job by ID
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised to update this job' });

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Job not found' });
    next(error);
  }
};

// @desc    Delete a job by ID
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised to delete this job' });
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ message: 'Job not found' });
    next(error);
  }
};

module.exports = {
  createJob,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
};
