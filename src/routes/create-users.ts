import z from "zod";
import prisma from "../lib/prisma";
import { CreateUserSchema } from "../schema";

export const CreateUser = async ({
  name,
  email,
}: z.infer<typeof CreateUserSchema>) => {
  const existUser = await prisma.user.findUnique({ where: { email } });

  if (existUser) return existUser;

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return newUser;
};
