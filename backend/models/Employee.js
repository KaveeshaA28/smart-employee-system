const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String, required: true },
  position: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "HR", "Manager", "Employee"],
    default: "Employee"
  },
  salary: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  address: { type: String },
  emergencyContact: { type: String },
  documents: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Auto generate employeeId
employeeSchema.pre("save", async function() {
  if (!this.employeeId) {
    const count = await mongoose.model("Employee").countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, "0")}`;
  }
});

module.exports = mongoose.model("Employee", employeeSchema);