const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  cancelLeave,
  getLeaveBalance
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/apply", protect, applyLeave);
router.get("/all", protect, authorize("Admin", "HR", "Manager"), getAllLeaves);
router.get("/balance/:employeeId", protect, getLeaveBalance);
router.get("/:employeeId", protect, getMyLeaves);
router.put("/status/:id", protect, authorize("Admin", "HR", "Manager"), updateLeaveStatus);
router.put("/cancel/:id", protect, cancelLeave);

module.exports = router;