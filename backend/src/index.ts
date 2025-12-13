import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stripeRoute from "./routes/stripeRoute";
import scanRoute from "./routes/scanRoute";
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/stripe", stripeRoute);
app.use(express.json());
app.use("/api/scan", scanRoute);

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
