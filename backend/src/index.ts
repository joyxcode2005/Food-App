import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.router";
import adminRouter from "./routes/admin.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Declaring global namespace
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      adminId?: string;
    }
  }
}

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is healthy!!!",
  });
});

// Setting up the routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
