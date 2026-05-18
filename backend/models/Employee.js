const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["Development", "Marketing", "HR", "Finance", "Design", "Sales", "Operations"],
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Skills array cannot be empty",
      },
    },
    performanceScore: {
      type: Number,
      required: [true, "Performance score is required"],
      min: [0, "Score cannot be less than 0"],
      max: [100, "Score cannot exceed 100"],
    },
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    aiRecommendation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
