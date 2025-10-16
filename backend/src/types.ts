import z, { email, string } from "zod";

export const userRegisterSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
  email: z.email(),
  password: z.string().min(3).max(10),
  confirmPassword: z.string().min(3).max(10),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(3).max(10),
});

export const userProfileUpdateSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(3).max(10).optional(),
  firstName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const adminLoginScheam = z.object({
  email: z.email(),
  password: z.string().min(3).max(10),
});

export const adminProfileUpdateSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(3).max(10).optional(),
  firstName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const restaurantCreateSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(10).max(100),
  location: z.string().optional(),
  phoneNumber: z.string().min(10),
  status: z.enum(["open", "close"]),
  time: z.string(),
  images: z.array(z.string()),
});

export const foodCreateScheam = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(10).max(100),
  type: z.enum(["veg", "non_veg"]),
  images: z.array(z.string()),
  amount: z.number(),
});

export enum RestaurantStatus {
  OPEN,
  CLOSE
}
