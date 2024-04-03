import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getAllAttendeesEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {},
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { eventId } = request.params;

      const attendees = await prisma.event.findMany({
        where: { id: eventId },
        select: {
          attendees: {
            select: {
              id: true,
              name: true,
              checkIn: true,
            },
          },
        },
      });

      return reply.send(attendees);
    }
  );
};
