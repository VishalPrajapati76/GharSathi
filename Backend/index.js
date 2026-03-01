const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/connect.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS (IMPORTANT: OPTIONS + PATCH included)
app.use(
  cors({
    origin:[
      "http://localhost:5173",
      "https://gharsathi.vercel.app"
    ]
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ preflight for ALL routes
app.options("*", cors());

app.use(cookieParser());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("GharSathi Backend Running ✅");
});

// health
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// ✅ Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/admin", require("./routes/adminRoutes"));

const ownerRoutes = require("./routes/ownerRoutes");
console.log("Owner Routes File Loaded:", ownerRoutes);

app.use("/api/owner", ownerRoutes);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
    console.log(`✅ Server running on port ${PORT}`);
  } catch (err) {
    console.log("❌ DB connect error:", err.message);
  }
});

