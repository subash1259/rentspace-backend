const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://rentspace-frontent.vercel.app",
    "https://mernproject-rho-two.vercel.app",
    "https://mernproject-8z14fhubg-subash-r-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/bookings",   require("./routes/bookingRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "RentSpace API Running! 🚀" });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

