import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getAllUsers, updateUserCredits } from "../controllers/adminController.js";

const router = express.Router();

// Admin only routes
router.get("/users", verifyToken, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/credits", verifyToken, authorizeRoles("admin"), updateUserCredits);

export default router;
