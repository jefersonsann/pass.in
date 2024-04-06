import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getAllEvents = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events",
    {
      schema: {
        summary: "Retorno de todos os eventos",
        tags: ["Events"],
        querystring: z.object({
          query: z.string().nullable().optional(),
          pageIndex: z.string().nullable().default("0").transform(Number),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { pageIndex, query } = request.query;

      const events = await prisma.event.findMany({
        where: query
          ? {
              title: {
                contains: query,
              },
            }
          : {},
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          createdAt: true,
          _count: true,
          CheckIn: { select: { id: true, _count: true } },
          attendees: { include: { _count: true } },
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: { createdAt: "desc" },
      });

      return reply.send({
        events: events.map((event) => {
          return {
            id: event.id,
            title: event.title,
            slug: event.slug,
            details: event.details,
            maximumAttendees: event.maximumAttendees,
            attendeesAmout: event._count.attendees,
            attendees: [
              event.attendees.map((attendee) => {
                return {
                  id: attendee.id,
                  name: attendee.name,
                  email: attendee.email,
                  checkedIn: attendee.checkInId,
                  checkedInAt: attendee.checkedInAt,
                };
              }),
            ],
          };
        }),
      });
    }
  );
};
