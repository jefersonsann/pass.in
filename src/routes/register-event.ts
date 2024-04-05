import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";
import { CreateUser } from "./create-users";

export const registerEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/user",
    {
      schema: {
        summary: "Registar usuário ao evento",
        tags: ["Events"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
          password: z.string().min(4),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            user: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const body = request.body;

      const existUser = await CreateUser(body);

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { attendees: true },
      });

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      const currentAttendeesCount = event.attendees.length;
      const maximumAttendees = event.maximumAttendees ?? Infinity;

      event.attendees.map((user) => {
        if (user.email === existUser.email) {
          throw new Error("Email já cadastrado!");
        }
      });

      if (currentAttendeesCount >= maximumAttendees) {
        throw new Error("Este evento já possui o máximo de participantes");
      }

      const user = await prisma.user.update({
        where: {
          id: existUser?.id,
        },
        data: {
          events: {
            connect: [{ id: eventId }],
          },
        },
      });
      return reply.code(201).send({ user: user.id });
    }
  );
};
