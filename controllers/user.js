const User = require('../models/User/User');
const bcrypt = require("bcrypt");

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle password hashing
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Handle uploaded profile picture
    if (req.file && req.file.location) {
      updateData.profilePicture = req.file.location;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

