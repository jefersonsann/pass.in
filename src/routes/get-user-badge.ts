import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getUserBadge = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/user/:userId/badge",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email(),
              events: z.array(
                z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                })
              ),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          events: {
            select: {
              id: true,
              title: true,
            },
          },
        },

        where: {
          id: userId,
        },
      });

      if (user === null)
        throw new Error("Usuário não encontrado, ou não existe.");

      const baseURL = `${request.protocol}://${request.hostname}`;
      const checkInURL = new URL(`/user/${userId}/check-in`, baseURL);

      return reply.status(200).send({
        badge: {
          id: user.id,
          name: user.name,
          email: user.email,
          events: user.events,
          checkInURL: checkInURL.toString(),
        },
      });
    }
  );
};
