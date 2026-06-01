const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark login attendance
const markLogin = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already marked login today" });
    }

    const loginTime = new Date();
    const workStartTime = new Date();
    workStartTime.setHours(9, 0, 0, 0);

    const status = loginTime > workStartTime ? "Late" : "Present";

    const attendance = new Attendance({
      employee: employeeId,
      loginTime,
      status
    });
    await attendance.save();

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark logout
const markLogout = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(404).json({ message: "No login found for today" });
    }

    const logoutTime = new Date();
    const workingHours = (logoutTime - attendance.loginTime) / (1000 * 60 * 60);

    attendance.logoutTime = logoutTime;
    attendance.workingHours = parseFloat(workingHours.toFixed(2));
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by employee
const getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employee: req.params.employeeId
    }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employee", "name employeeId department")
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today attendance
const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: { $gte: today }
    }).populate("employee", "name employeeId department");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { markLogin, markLogout, getEmployeeAttendance, getAllAttendance, getTodayAttendance };