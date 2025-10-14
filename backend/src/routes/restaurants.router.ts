import { Request, Response, Router } from "express";

const router = Router();

// To get all the restaurants
router.get("/", (req: Request, res: Response) => {});

// To get the details about a restaurant
router.get("/:id", (req: Request, res: Response) => {});

export default router;
