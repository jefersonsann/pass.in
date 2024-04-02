import bcrypt from "bcryptjs";
import z from "zod";
import prisma from "../lib/prisma";
import { CreateUserSchema } from "../schema";

export const CreateUser = async ({
  name,
  email,
  password,
}: z.infer<typeof CreateUserSchema>) => {
  // if (!user) throw new Error("Usuário não encontrado ou não existe")
  // const { name, email, password } = user;

  const existUser = await prisma.user.findUnique({ where: { email } });

  if (existUser) return existUser;

  const hashPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  return newUser;
};
