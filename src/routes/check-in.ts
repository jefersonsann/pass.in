import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const CheckInEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/user/:userId/check-in",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
          eventId: z.string().uuid(),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { userId, eventId } = request.params;

      // Verificar se o usuário já fez check-in em outro evento
      const userCheckIn = await prisma.user.findUnique({
        where: { id: userId },
        include: { checkIn: true },
      });

      if (userCheckIn?.checkInId !== null) {
        throw new Error("Você já fez check-in em outro evento");
      }

      // Verificar se o evento existe e se o usuário está cadastrado nele
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { attendees: true },
      });

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      const userIsAttendee = event.attendees.some(
        (attendee) => attendee.id === userId
      );

      if (!userIsAttendee) {
        throw new Error("Você não está cadastrado neste evento");
      }

      // Atualizar o campo checkInId no usuário para o ID do check-in criado
      await prisma.checkIn.update({
        where: { eventId: eventId },
        data: {
          attendees: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return reply.send({ message: "Check-in realizado com sucesso" });
    }
  );
};
