import jwt from "jsonwebtoken";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import multer from "multer";

import { Request, Response, Router } from "express";
import { adminLoginScheam, adminProfileUpdateSchema } from "../types";

import adminMiddleware from "../middlewares/admin.middleware";
import restaurantRouter from "./restaurants.router";

const router = Router();
const upload = multer();
const JWT_SECRET = process.env.JWT_SECRET || "";

router.post("/login", async (req: Request, res: Response) => {
  const { success, error, data } = adminLoginScheam.safeParse(req.body);

  if (!success)
    return res.status(409).json({
      message: `Invalid Input: ${error}`,
    });

  const { email, password } = data;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 2,
    });

    return res.status(202).json({
      success: true,
      message: "User looged in successfully!!",
    });
  } catch (error) {
    console.error("Some error occured during admin login: ", error);
    return res.status(500).json({
      message: "Internal Server Error!!",
    });
  }
});

router.use(adminMiddleware);

router.get("/me", async (req: Request, res: Response) => {
  const adminId = req.adminId;

  if (!adminId) {
    return res.status(401).json({
      message: "Invalid or expired token!!",
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin)
      return res.status(404).json({
        message: "Admin profile not found!!",
      });

    return res.status(202).json({
      success: true,
      message: "Admin profile found",
      admin: {
        fistName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Some error occured: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!!",
    });
  }
});

router.put("/me", async (req: Request, res: Response) => {
  const adminId = req.adminId;
  const { success, error, data } = adminProfileUpdateSchema.safeParse(req.body);

  if (!success) {
    return res.status(406).json({
      message: "Invalid Input",
      errors: error,
    });
  }

  let { firstName, lastName, email, password } = data;

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updates: any = {};
    const updatedFields: string[] = [];

    if (firstName && firstName !== existingAdmin.firstName) {
      updates.firstName = firstName;
      updatedFields.push("first name");
    }

    if (lastName && lastName !== existingAdmin.lastName) {
      updates.lastName = lastName;
      updatedFields.push("last name");
    }

    if (email && email !== existingAdmin.email) {
      updates.email = email;
      updatedFields.push("email");
    }

    if (password) {
      const isSamePassword = await bcrypt.compare(
        password,
        existingAdmin.password
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

    const updatedUser = await prisma.admin.update({
      where: { id: adminId },
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
      },
    });
  } catch (error) {}
});

// Router for restaurants related details
router.use("/restaurants", restaurantRouter);

export default router;
