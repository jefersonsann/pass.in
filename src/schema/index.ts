import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Nome deve conter ao menos 4 caracteres" }),
  email: z.string().email(),
});

export const CreateEventSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Titulo deve conter ao menos 4 caracteres" }),
  details: z.string().nullable(),
  maximumAttendees: z.number().int().positive().nullable(),
});
