const User = require('../models/user.model');
const Job = require('../models/job.model');
const { uploadFromBuffer } = require('../utils/cloudinaryHelper');

// @desc    Update company profile
// @route   PATCH /api/user/update-company
// @access  Private
const updateCompanyProfile = async (req, res, next) => {
  const {
    logo, // legacy fallback if passed as string directly
    companyName,
    organizationType,
    industryType,
    teamSize,
    yearOfEstablishment,
    aboutUs,
    location,
    contactNumber,
    email
  } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    let logoUrl = logo || user.company.logo;

    if (req.file) {
        try {
            // Upload buffer directly to Cloudinary
            const result = await uploadFromBuffer(req.file.buffer, {
                folder: 'company-logo',
                resource_type: 'image',
                access_mode: 'public'
            });
            logoUrl = result.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error('Logo upload failed: ' + error.message);
        }
    }

    // Update company fields
    user.company = {
      logo: logoUrl,
      companyName: companyName || user.company.companyName,
      organizationType: organizationType || user.company.organizationType,
      industryType: industryType || user.company.industryType,
      teamSize: teamSize || user.company.teamSize,
      yearOfEstablishment: yearOfEstablishment || user.company.yearOfEstablishment,
      aboutUs: aboutUs || user.company.aboutUs,
      location: location || user.company.location,
      contactNumber: contactNumber || user.company.contactNumber,
      email: email || user.company.email,
    };

    const updatedUser = await user.save();

    res.json({
      company: updatedUser.company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all associated jobs
// @route   DELETE /api/user/delete-account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete all jobs posted by this user
    await Job.deleteMany({ employer: req.user.id });

    // Delete the user account
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: 'Account and associated jobs deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateCompanyProfile,
  deleteAccount,
};
