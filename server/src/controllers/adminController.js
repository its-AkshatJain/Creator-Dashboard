import User from "../models/userModel.js";

// Get all users for admin panel
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username credits role"); // select only relevant fields
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Update user credits
const updateUserCredits = async (req, res) => {
  const { id } = req.params;
  const { credits } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.credits = credits;
    await user.save();

    res.status(200).json({ message: "Credits updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating credits", error: err.message });
  }
};

export { getAllUsers, updateUserCredits };
