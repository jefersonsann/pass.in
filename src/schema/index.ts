import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Nome deve conter ao menos 4 caracteres" }),
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "A senha deve ter no minimo 4 caracteres" }),
});

export const CreateEventSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Titulo deve conter ao menos 4 caracteres" }),
  details: z.string().nullable(),
  maximumAttendees: z.number().int().positive().nullable(),
});
