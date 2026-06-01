const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");

// Generate payroll
const generatePayroll = async (req, res) => {
  try {
    const { employee, month, year, basicSalary, allowances, deductions, tax, loans } = req.body;

    const existingPayroll = await Payroll.findOne({ employee, month, year });
    if (existingPayroll) {
      return res.status(400).json({ message: "Payroll already generated for this month" });
    }

    const payroll = new Payroll({
      employee, month, year, basicSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      tax: tax || 0,
      loans: loans || 0
    });
    await payroll.save();

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payrolls
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "name employeeId department")
      .sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee payrolls
const getEmployeePayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.params.employeeId })
      .sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as paid
const markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status: "Paid", paidAt: new Date() },
      { new: true }
    );
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payroll
const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generatePayroll, getAllPayrolls, getEmployeePayrolls, markAsPaid, updatePayroll };