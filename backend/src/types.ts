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
