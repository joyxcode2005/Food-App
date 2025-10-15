import z, { email } from "zod";

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

enum RestaurantStatus {
  OPEN,
  CLOSE,
}

enum FoodType {
  VEG,
  NON_VEG,
}

export interface FoodData {
  id: string,
  name: string,
  description: string,
  type: FoodType,
  images: string[],
  amount: number,
  restaurantId: string,
}

export interface RestaurantData {
  id: string;
  name: string;
  description: string;
  location?: string;
  phoneNumber: string;
  status: RestaurantStatus;
  time: string,
  images: string[],
  food: FoodData[],
}
