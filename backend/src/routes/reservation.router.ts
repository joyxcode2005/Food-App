import { Request, Response, Router } from "express";

const router = Router();

// To make a reservation
router.post("/reservation", (req: Request, res: Response) => {});

// To get all the reservations of a user
router.get("/", (req: Request, res: Response) => {});

// To get reservation details
router.get("/:id", (req: Request, res: Response) => {});

// To cancel a reservation
router.put("/:id/cancel", (req: Request, res: Response) => {});

export default router;
