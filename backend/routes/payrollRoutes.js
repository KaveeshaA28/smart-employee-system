const express = require("express");
const router = express.Router();
const {
  generatePayroll,
  getAllPayrolls,
  getEmployeePayrolls,
  markAsPaid,
  updatePayroll
} = require("../controllers/payrollController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/generate", protect, authorize("Admin", "HR"), generatePayroll);
router.get("/all", protect, authorize("Admin", "HR"), getAllPayrolls);
router.get("/:employeeId", protect, getEmployeePayrolls);
router.put("/paid/:id", protect, authorize("Admin", "HR"), markAsPaid);
router.put("/:id", protect, authorize("Admin", "HR"), updatePayroll);

module.exports = router;