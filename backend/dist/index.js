"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const stripeRoute_1 = __importDefault(require("./routes/stripeRoute"));
const scanRoute_1 = __importDefault(require("./routes/scanRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const ebayRoute_1 = __importDefault(require("./routes/ebayRoute"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use("/api/stripe", stripeRoute_1.default);
app.use(express_1.default.json());
app.use("/api/scan", scanRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use("/api/ebay", ebayRoute_1.default);
// Basic health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
