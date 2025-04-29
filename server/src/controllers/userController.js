import User from "../models/userModel.js";

export const updateProfileField = async (req, res) => {
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

export const getProfile = async (req, res) => {
    try {
      const me = await User.findById(req.user.id).select(
        "username profile credits savedPosts reportedPosts lastLogin"
      );
  
      const today = new Date();
      const last = me.lastLogin;
      const isSameDay =
        last && today.toDateString() === new Date(last).toDateString();
  
      let dailyBonusGiven = false;
      if (!isSameDay) {
        me.credits += 5;
        me.lastLogin = today;
        await me.save();
        dailyBonusGiven = true;
      }
  
      // If admin, gather analytics
      let analytics = null;
      if (req.user.role === "admin") {
        const totalUsers = await User.countDocuments();
        const totalSaved = await User.aggregate([
          { $unwind: "$savedPosts" },
          { $count: "n" },
        ]);
        const totalReported = await User.aggregate([
          { $unwind: "$reportedPosts" },
          { $count: "n" },
        ]);
        analytics = {
          totalUsers,
          totalSaved: totalSaved[0]?.n || 0,
          totalReported: totalReported[0]?.n || 0,
        };
      }
  
      res.json({
        username: me.username, // ✅ added
        profile: me.profile,
        credits: me.credits,
        dailyBonusGiven,
        savedPosts: me.savedPosts.slice(-5).reverse(),
        reportedPosts: me.reportedPosts.slice(-5).reverse(),
        analytics,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  };
  
  
  
  

  export const savePost = async (req, res) => {
    const { post } = req.body;
    const user = await User.findById(req.user.id);
  
    // prevent dupes
    if (user.savedPosts.find(p => p.id === post.id && p.platform === post.platform)) {
      return res.status(400).json({ message: "Already saved" });
    }
  
    // award 2 credits for saving
    user.credits += 2;
  
    user.savedPosts.push({
      id: post.id,
      platform: post.platform,
      title: post.title || "",
      content: post.content,
      url: post.url
    });
  
    await user.save();
    res.json({ savedPosts: user.savedPosts, credits: user.credits });
  };
  
  export const reportPost = async (req, res) => {
    const { post } = req.body;
    const user = await User.findById(req.user.id);
  
    // award 1 credit for reporting
    user.credits += 1;
  
    user.reportedPosts.push({
      id: post.id,
      platform: post.platform,
      title: post.title || "",
      content: post.content,
      url: post.url
    });
  
    await user.save();
    res.json({ reportedPosts: user.reportedPosts, credits: user.credits });
  };

  // GET /api/users/saved
export const getSavedPosts = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("savedPosts");
      res.json(user.savedPosts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching saved posts" });
    }
  };
  
  // GET /api/users/reported
  export const getReportedPosts = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("reportedPosts");
      res.json(user.reportedPosts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching reported posts" });
    }
  };
