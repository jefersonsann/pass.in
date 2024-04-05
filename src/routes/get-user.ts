import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/user/:userId",
    {
      schema: {
        summary: "Buscar unico usuário por Id",
        tags: ["User"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email(),
              events: z.array(
                z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                })
              ),
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

      return reply.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          events: user.events,
        },
      });
    }
  );
};
