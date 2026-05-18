const Employee = require("../models/Employee");
const fetch = require("node-fetch");

// Helper: Call OpenRouter AI API
const callAI = async (prompt) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5000",
      "X-Title": "Employee AI System",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",  // Free model on OpenRouter
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst. Provide concise, professional, and actionable recommendations for employees. Keep responses under 150 words.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
};

// @route   POST /api/ai/recommend
// @desc    Get AI recommendation for a single employee
// @access  Private
const getRecommendation = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    const prompt = `Analyze this employee and provide a recommendation:
Name: ${employee.name}
Department: ${employee.department}
Skills: ${employee.skills.join(", ")}
Performance Score: ${employee.performanceScore}/100
Years of Experience: ${employee.experience}

Based on this data, provide:
1. Should they be promoted? Why?
2. What training do they need?
3. Overall feedback and next steps.`;

    const recommendation = await callAI(prompt);

    // Save recommendation to DB
    employee.aiRecommendation = recommendation;
    await employee.save();

    res.json({ success: true, recommendation, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI API Error: " + error.message });
  }
};

// @route   POST /api/ai/rank
// @desc    Get AI ranking for all employees
// @access  Private
const rankEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    if (employees.length === 0) {
      return res.status(400).json({ success: false, message: "No employees found to rank" });
    }

    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore} | Exp: ${e.experience}yrs | Skills: ${e.skills.join(", ")}`
      )
      .join("\n");

    const prompt = `Here are the employees ranked by performance score. Provide a brief analysis of the top 3 and bottom performer, and suggest which departments need attention:\n\n${employeeList}`;

    const analysis = await callAI(prompt);
    res.json({ success: true, analysis, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI API Error: " + error.message });
  }
};

// @route   POST /api/ai/training
// @desc    Get training suggestions for an employee
// @access  Private
const getTrainingSuggestions = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    const prompt = `Employee: ${employee.name}
Department: ${employee.department}
Current Skills: ${employee.skills.join(", ")}
Performance Score: ${employee.performanceScore}/100
Experience: ${employee.experience} years

Suggest 3-5 specific online courses, certifications, or skill areas this employee should focus on to advance their career. Be specific with course names or platforms.`;

    const suggestions = await callAI(prompt);
    res.json({ success: true, suggestions, employee });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI API Error: " + error.message });
  }
};

module.exports = { getRecommendation, rankEmployees, getTrainingSuggestions };
