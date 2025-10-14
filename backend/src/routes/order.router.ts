import { Request, Response, Router } from "express";

const router = Router();

// To place an order
router.post("/order", (req: Request, res: Response) => {});

// To get all the orders of the user
router.get("/", (req: Request, res: Request) => {});

// To get order details of a specific order of the user
router.get("/:orderId", (req: Request, res: Response) => {});

// To cancel an order
router.put("/:orderId/cancel", (req: Request, res: Response) => {});

export default router;
