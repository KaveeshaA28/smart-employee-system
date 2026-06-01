const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", protect, getEmployees);
router.get("/search", protect, searchEmployees);
router.get("/:id", protect, getEmployee);
router.post("/", protect, authorize("Admin", "HR"), createEmployee);
router.put("/:id", protect, authorize("Admin", "HR"), updateEmployee);
router.delete("/:id", protect, authorize("Admin", "HR"), deleteEmployee);

module.exports = router;