import { Request, Response, Router } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

import userMiddleware from "../middlewares/user.middleware";

import restaurantsRouter from "./restaurants.router";
import cartRouter from "./carts.router";
import orderRouter from "./order.router";
import reservationRouter from "./reservation.router";
import {
  userLoginSchema,
  userProfileUpdateSchema,
  userRegisterSchema,
} from "../types";
import uploadFile from "../services/uploadToS3.service";
import prisma from "../config/db";

const router = Router();
const upload = multer();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";

// Register User
router.post(
  "/register",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      // Zod validation
      const parseResult = userRegisterSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: parseResult.error,
        });
      }

      const { email, password, firstName, lastName, confirmPassword } =
        parseResult.data;

      // Password match check
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }

      // Check for existing user
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload avatar if exists
      let avatar: string | undefined;
      if (req.file) {
        avatar = await uploadFile(req.file);
      }

      // Create user
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          avatar,
        },
      });

      if (!newUser)
        return res.status(500).json({ message: "Internal server error" });

      // Generate JWT token
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      //  Response
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        data: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          avatar: newUser.avatar,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// login User
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Zod validation
    const parseResult = userLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parseResult.error,
      });
    }

    const { email, password } = req.body;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res
        .status(409)
        .json({ message: "User does't exists or incorrent password" });
    }

    // Hash password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(409)
        .json({ message: "User does't exists or incorrent password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return token and user info
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        avatar: existingUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.use(userMiddleware);

// Get profile details
router.get("/me", async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!!" });
    }

    return res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
      message: "User found!",
    });
  } catch (error) {
    console.error("Some error occured: ", error);
    return res.status(500).json({
      message: "Internal server error!!",
    });
  }
});

// Update the profile detials
router.put(
  "/me",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { success, error } = userProfileUpdateSchema.safeParse(req.body);
    const file = req.file;

    if (!success) {
      return res.status(406).json({
        message: "Invalid Input",
        errors: error,
      });
    }

    let { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let avatar: string | undefined;
      const updates: any = {};
      const updatedFields: string[] = [];

      if (file) {
        avatar = await uploadFile(file);
      }

      if (avatar) {
        updates.avatar = avatar;
        updatedFields.push("avatar");
      }

      if (firstName && firstName !== existingUser.firstName) {
        updates.firstName = firstName;
        updatedFields.push("first name");
      }

      if (lastName && lastName !== existingUser.lastName) {
        updates.lastName = lastName;
        updatedFields.push("last name");
      }

      if (email && email !== existingUser.email) {
        updates.email = email;
        updatedFields.push("email");
      }

      if (password) {
        const isSamePassword = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isSamePassword) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updates.password = hashedPassword;
          updatedFields.push("password");
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(200).json({
          success: true,
          message: "No changes detected. User profile remains the same.",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates,
      });

      return res.status(200).json({
        success: true,
        message: `${updatedFields.join(", ")} updated successfully!`,
        updatedFields,
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
        },
      });
    } catch (error) {
      console.error("Error while updating user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Restaurant router for user
router.use("/restaurants", restaurantsRouter);

// Cart router for user
router.use("/carts", cartRouter);

// Orders router for user
router.use("/orders", orderRouter);

// Reservations router for user
router.use("/reservations", reservationRouter);

export default router;
