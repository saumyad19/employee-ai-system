const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected (need JWT)
router.use(protect);

router.post("/", addEmployee);
router.get("/", getAllEmployees);
router.get("/search", searchEmployees);
router.get("/:id", getEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
