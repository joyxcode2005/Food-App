import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user.router";
import adminRouter from "./routes/admin.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Declaring global namespace
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

app.get("/", (req: Request, res: Response) => {
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
