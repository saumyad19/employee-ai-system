const express = require("express");
const router = express.Router();
const { getRecommendation, rankEmployees, getTrainingSuggestions } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/recommend", getRecommendation);
router.post("/rank", rankEmployees);
router.post("/training", getTrainingSuggestions);

module.exports = router;
