import { NextFunction, Request, Response, Router } from "express";
import prisma from "../config/db";
import multer from "multer";
import { restaurantCreateSchema } from "../types";
import uploadFile from "../services/uploadToS3.service";
import { RestaurantStatus } from "../generated/prisma";

const router = Router();
const upload = multer();

// To get all the restaurants
router.get("/", async (req: Request, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      omit: {
        adminId: true,
      },
      include: {
        food: true,
      },
    });

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
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const restaurantId = req.params.id;

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { id: restaurantId },
      include: {
        food: true,
      },
    });

    if (!restaurant)
      return res.status(404).json({
        success: false,
        message: "No restaurant found!!",
      });

    return res.status(200).json({
      success: true,
      message: "Restaurant found!!",
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        location: restaurant.location,
        phoneNumber: restaurant.phoneNumber,
        status: restaurant.status,
        time: restaurant.time,
        foods: restaurant.food,
        images: restaurant.images,
      },
    });
  } catch (error) {
    console.error("Some error occured: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    });
  }
});

// To create a new restaurant
router.post(
  "/",
  upload.array("images", 5),
  async (req: Request, res: Response) => {
    const { success, error, data } = restaurantCreateSchema.safeParse(req.body);
    const adminId = req.adminId;

    if (!success) {
      return res.status(401).json({
        success: false,
        message: "Invalid Input!!",
        error: error.flatten(),
      });
    }
    const { name, phoneNumber, status, time, location, description, images } =
      data;

    // Validate and sanitize image uploads
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required!",
      });
    }

    try {
      // Upload each image to S3 and get URLs
      const imageUploadPromises = files.map((file) => uploadFile(file));
      const imageUrls = await Promise.all(imageUploadPromises);

      // Save restaurant to database with image urls
      const restaurant = await prisma.restaurant.create({
        data: {
          name: name.trim(),
          location: location?.trim() || "",
          description: description.trim(),
          images: imageUrls,
          phoneNumber: phoneNumber.trim(),
          status: status.toUpperCase() as RestaurantStatus,
          time: time,
          Admin: {
            connect: {
              id: adminId,
            },
          },
        },
      });

      // Send response
      return res.status(201).json({
        success: true,
        message: "Restaurant created successfully!",
        data: restaurant,
      });
    } catch (error) {
      console.error("Error creating restaurant: ", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);



export default router;
