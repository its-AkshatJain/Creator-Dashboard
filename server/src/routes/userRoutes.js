import express from "express";
import verifyToken from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"
const router = express.Router();

// Only admin can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// router.get("/manager", (req, res) => {
//   res.json({ message: "Welcome Manager" });
// });

// All can access this router
router.get("/user", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
    res.json({ message: "Welcome User" })
});

export default router;