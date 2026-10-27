import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.js";
import authRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));






app.use("/api/auth",authRouter)
app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "PUT", "DELETE", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
    ],
    credentials: true,
  }),
);



app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("working....");
});

export default app;
