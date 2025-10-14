import { Request, Response, Router } from "express";

const router = Router();

// To create a new cart
router.post("/cart", (req: Request, res: Response) => {});

// To get details of a specific cart
router.get("/:cartId", (req: Request, res: Response) => {});

// To update a cart
router.put("/:cartId", (req: Request, res: Response) => {});

// To delete a cart
router.delete("/:cartId", (req: Request, res: Response) => {});

export default router;
