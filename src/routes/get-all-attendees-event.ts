import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getAllAttendeesEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Retorno de usuario inscritos no evento",
        tags: ["Events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullable().optional(),
          pageIndex: z.string().nullable().default("0").transform(Number),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;

      const attendees = await prisma.event.findMany({
        where: {
          id: eventId,
        },
        include: {
          _count: {
            select: {
              attendees: {
                where: {
                  name: query
                    ? {
                        contains: query,
                      }
                    : undefined,
                },
              },
            },
          },
          attendees: {
            where: {
              name: query
                ? {
                    contains: query,
                  }
                : undefined,
            },
            take: 10,
            skip: pageIndex * 10,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return reply.send({
        attendees: attendees[0].attendees.map((attendee) => ({
          id: attendee.id,
          name: attendee.name,
          createdAt: attendee.createdAt,
          checkedInAt: attendee.checkedInAt,
        })),
        total: attendees[0]._count.attendees,
      });
    }
  );
};
