import { Request, Response, Router } from "express";
import prisma from "../config/db";
import { RestaurantData } from "../types";

const router = Router();

// To get all the restaurants
router.get("/", async (req: Request, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany();

    if (!restaurants)
      return res.status(404).json({
        success: false,
        message: "No restaurants available to show!!",
        restaurants: [],
      });

    return res.status(200).json({
      success: true,
      message: "Restaurants found!!",
      restaurants,
    });
  } catch (error) {
    console.error("Some error occured: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
});

// To get the details about a restaurant
router.get("/:id", (req: Request, res: Response) => {

});

export default router;
