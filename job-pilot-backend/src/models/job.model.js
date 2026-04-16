const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    jobRole: {
      type: String,
      required: [true, 'Please specify the job role'],
    },
    minSalary: {
      type: Number,
    },
    maxSalary: {
      type: Number,
    },
    salaryType: {
      type: String,
      enum: ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
      default: 'Monthly',
    },
    education: {
      type: String,
      required: [true, 'Please specify the education level required'],
    },
    experience: {
      type: String,
      required: [true, 'Please specify the experience required'],
    },
    jobType: {
      type: String,
      required: [true, 'Please specify the job type'],
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Temporary'],
    },
    vacancies: {
      type: Number,
      required: [true, 'Please specify the number of vacancies'],
    },
    expirationDate: {
      type: Date,
      required: [true, 'Please specify an expiration date'],
    },
    jobLevel: {
      type: String,
      required: [true, 'Please specify the job level (e.g., Entry, Mid, Senior)'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    country: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    fullyRemote: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
