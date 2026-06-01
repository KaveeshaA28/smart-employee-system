const Leave = require("../models/Leave");

// Apply leave
const applyLeave = async (req, res) => {
  try {
    const { employee, leaveType, startDate, endDate, reason } = req.body;

    const leave = new Leave({
      employee, leaveType, startDate, endDate, reason
    });
    await leave.save();

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name employeeId department")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject leave
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        comments,
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel leave
const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave balance
const getLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const year = new Date().getFullYear();

    const leaves = await Leave.find({
      employee: employeeId,
      status: "Approved",
      startDate: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      }
    });

    const balance = {
      Annual: 14,
      Sick: 7,
      Casual: 7,
      Maternity: 84,
      Paternity: 3,
      Unpaid: 0
    };

    const used = {
      Annual: 0, Sick: 0, Casual: 0,
      Maternity: 0, Paternity: 0, Unpaid: 0
    };

    leaves.forEach(leave => {
      if (used[leave.leaveType] !== undefined) {
        used[leave.leaveType] += leave.days || 0;
      }
    });

    const remaining = {};
    Object.keys(balance).forEach(type => {
      remaining[type] = balance[type] - used[type];
    });

    res.json({ balance, used, remaining });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, cancelLeave, getLeaveBalance };