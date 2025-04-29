import User from "../models/userModel.js";

const updateProfileField = async (req, res) => {
  const { field, value } = req.body;
  const userId = req.user.id;

  const CREDIT_VALUES = {
    profileImage: 20,
    linkedin: 10,
    instagram: 10,
    twitter: 10,
    gmail: 10,
  };

  try {
    const user = await User.findById(userId);

    // Award credits only once
    if (!user.completedFields[field] && CREDIT_VALUES[field]) {
      user.credits += CREDIT_VALUES[field];
      user.completedFields[field] = true;
    }

    // Update the actual profile field
    user.profile[field] = value;
    await user.save();

    res.status(200).json({
      message: `${field} updated successfully.`,
      credits: user.credits,
    });
  } catch (err) {
    res.status(500).json({ message: `Error updating profile: ${err.message}` });
  }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      const today = new Date();
      const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
      const isSameDay =
        lastLoginDate &&
        today.getFullYear() === lastLoginDate.getFullYear() &&
        today.getMonth() === lastLoginDate.getMonth() &&
        today.getDate() === lastLoginDate.getDate();
  
      let dailyBonusGiven = false;
  
      if (!isSameDay) {
        user.credits += 5;
        user.lastLogin = today;
        await user.save();
        dailyBonusGiven = true;
      }
  
      res.status(200).json({
        profile: user.profile,
        credits: user.credits,
        dailyBonusGiven,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  };
  
export { updateProfileField, getProfile };
