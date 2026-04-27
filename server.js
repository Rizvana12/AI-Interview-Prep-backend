require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db")
const app = express();
const authRoutes = require("./routes/authRoutes")
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const {protect} = require('./middlewares/authMiddleware')
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

// ensure uploads directory exists before any requests
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware to handle CORS 

app.use(
    cors({
        origin:"*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders:["Content-Type", "Authorization"],
    })
);

connectDB().catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});

// Middleware
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation)

// Serve uploads folder
app.use("/uploads", express.static(uploadsDir, {}));

// Error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))