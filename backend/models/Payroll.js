const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  loans: { type: Number, default: 0 },
  netSalary: { type: Number },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  },
  paidAt: { type: Date }
}, { timestamps: true });

payrollSchema.pre("save", function() {
  this.netSalary = (this.basicSalary + this.allowances) - (this.deductions + this.tax + this.loans);
});

module.exports = mongoose.model("Payroll", payrollSchema);