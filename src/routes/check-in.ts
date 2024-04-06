import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const CheckInEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/user/:userId/check-in",
    {
      schema: {
        summary: "Check-in",
        tags: ["Check-in"],
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
        include: {
          CheckIn: {
            select: {
              id: true,
              _count: true,
            },
          },
          attendees: true,
        },
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
      console.log(userId);

      try {
        const checkin = await prisma.checkIn.update({
          where: { id: +event.CheckIn?.id! },
          data: {
            attendees: {
              connect: {
                id: userId,
              },
            },
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            checkedInAt: new Date(),
          },
        });

        return reply.send({ message: "Check-in realizado com sucesso" });
      } catch (error) {
        throw new Error("Erro ao fazer check-in: " + error);
      }
    }
  );
};
