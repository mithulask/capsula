import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(4000, () => console.log("Backend running on http://localhost:4000"));

