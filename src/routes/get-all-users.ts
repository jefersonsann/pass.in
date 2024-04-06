import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import prisma from "../lib/prisma";

export const getAllUsers = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      schema: {
        summary: "Retorno de todos os usuários",
        tags: ["Users"],
        querystring: z.object({
          query: z.string().nullable().optional(),
          pageIndex: z.string().nullable().default("0").transform(Number),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { pageIndex, query } = request.query;

      const users = await prisma.user.findMany({
        where: query
          ? {
              name: {
                contains: query,
              },
            }
          : {},
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: true,
          checkedInAt: true,
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: { createdAt: "desc" },
      });

      return reply.send(users);
    }
  );
};
