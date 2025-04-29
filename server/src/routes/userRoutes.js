import express from "express";
import verifyToken from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"
import {
    updateProfileField,
    getProfile,
    savePost,
    reportPost,
    getSavedPosts,
    getReportedPosts
  } from "../controllers/userController.js";

const router = express.Router();

// Only admin can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// All can access this router
router.get("/user", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
    res.json({ message: "Welcome User" })
});

// Profile Update with Credit Logic
router.post("/update-profile", verifyToken, updateProfileField);

router.get("/me", verifyToken, getProfile);

// Save & report
router.post("/save",   verifyToken, savePost);
router.post("/report", verifyToken, reportPost);

router.get("/saved",    verifyToken, getSavedPosts);
router.get("/reported", verifyToken, getReportedPosts);

export default router;