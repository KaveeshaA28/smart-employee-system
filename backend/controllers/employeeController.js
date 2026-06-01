const Employee = require("../models/Employee");

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position, role, salary, address, emergencyContact } = req.body;

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const employee = new Employee({
      name, email, phone, department, position, role, salary, address, emergencyContact
    });
    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete employee (soft delete)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search employees
const searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    const employees = await Employee.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
        { employeeId: { $regex: query, $options: "i" } }
      ]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, searchEmployees };