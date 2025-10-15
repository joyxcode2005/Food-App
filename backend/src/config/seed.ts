import prisma from "./db";
import bcrypt from "bcryptjs";

async function seed() {
  const password = "admin2005";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      firstName: "Admin",
      email: "admin2005@gmail.com",
      password: hashedPassword,
    },
  });
}

seed()
  .then(() => console.log("Database seeded!"))
  .catch((e) => console.error(e));
