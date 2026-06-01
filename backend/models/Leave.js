const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  leaveType: {
    type: String,
    enum: ["Annual", "Sick", "Casual", "Maternity", "Paternity", "Unpaid"],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending"
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  medicalDocument: { type: String },
  comments: { type: String }
}, { timestamps: true });

leaveSchema.pre("save", function() {
  if (this.startDate && this.endDate) {
    const diff = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    this.days = Math.ceil(diff) + 1;
  }
});

module.exports = mongoose.model("Leave", leaveSchema);