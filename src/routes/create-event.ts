import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";
import { generateSlug } from "../utils/generate-slug";

export const createEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Criação de evento",
        tags: ["Events"],
        body: z.object({
          title: z
            .string()
            .min(4, { message: "Titulo deve conter ao menos 4 caracteres" }),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;

      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: { slug },
      });

      if (eventWithSameSlug !== null) {
        throw new Error("Event already exists");
      }

      const event = await prisma.event.create({
        data: {
          title,
          slug,
          details,
          maximumAttendees,
        },
      });

      await prisma.checkIn.create({
        data: {
          event: {
            connect: { id: event.id },
          },
        },
      });
      reply.code(201).send({ eventId: event.id });
    }
  );
};
