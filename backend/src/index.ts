import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoute from "./routes/scanRoute";
import profileRoute from "./routes/profileRoute";
import ebayRoute from "./routes/ebayRoute";
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

app.use(express.json());
app.use("/api/scan", scanRoute);
app.use("/api/profile", profileRoute);
app.use("/api/ebay", ebayRoute);
// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
