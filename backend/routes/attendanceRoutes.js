const express = require("express");
const router = express.Router();
const {
  markLogin,
  markLogout,
  getEmployeeAttendance,
  getAllAttendance,
  getTodayAttendance
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/login", protect, markLogin);
router.post("/logout", protect, markLogout);
router.get("/today", protect, authorize("Admin", "HR", "Manager"), getTodayAttendance);
router.get("/all", protect, authorize("Admin", "HR", "Manager"), getAllAttendance);
router.get("/:employeeId", protect, getEmployeeAttendance);

module.exports = router;