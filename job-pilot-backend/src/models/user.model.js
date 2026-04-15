const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    company: {
      logo: {
        type: String,
        default: '',
      },
      companyName: {
        type: String,
        default: '',
      },
      organizationType: {
        type: String,
        default: '',
      },
      industryType: {
        type: String,
        default: '',
      },
      teamSize: {
        type: String,
        default: '',
      },
      yearOfEstablishment: {
        type: String,
        default: '',
      },
      aboutUs: {
        type: String,
        default: '',
      },
      location: {
        type: String,
        default: '',
      },
      contactNumber: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid company email',
        ],
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('User', userSchema);
