import express    from "express";
import cors       from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

// ── CORS — allow frontend dev server ──────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Health check ──────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "BATTLECODE API ONLINE ⚔️" });
});

export default app;