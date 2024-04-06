import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Buscar evento unico por Id",
        tags: ["Events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmout: z.number().int(),
              createdAt: z.date(),
              attendees: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  checkedInAt: z.date().nullable(),
                })
              ),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          createdAt: true,
          attendees: {
            select: {
              id: true,
              name: true,
              checkedInAt: true,
            },
          },
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        where: {
          id: eventId,
        },
      });

      if (event === null)
        throw new Error("Evento não encontrado, ou não existe.");

      return reply.status(200).send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmout: event._count.attendees,
          createdAt: event.createdAt,
          attendees: event.attendees,
        },
      });
    }
  );
};
