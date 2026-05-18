const Employee = require("../models/Employee");

// @route   POST /api/employees
// @desc    Add new employee
// @access  Private
const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Employee with this email already exists" });
    }

    const employee = await Employee.create({ name, email, department, skills, performanceScore, experience });

    res.status(201).json({ success: true, message: "Employee added successfully", employee });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    res.json({ success: true, count: employees.length, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/employees/search
// @desc    Search employees by department or name
// @access  Private
const searchEmployees = async (req, res) => {
  try {
    const { department, name, minScore, maxScore } = req.query;
    const query = {};

    if (department) query.department = department;
    if (name) query.name = { $regex: name, $options: "i" };
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });
    res.json({ success: true, count: employees.length, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/employees/:id
// @desc    Get single employee
// @access  Private
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, message: "Employee updated successfully", employee });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addEmployee, getAllEmployees, searchEmployees, getEmployee, updateEmployee, deleteEmployee };
