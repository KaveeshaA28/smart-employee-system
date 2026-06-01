const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, default: Date.now },
  loginTime: { type: Date },
  logoutTime: { type: Date },
  workingHours: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Half Day"],
    default: "Present"
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);