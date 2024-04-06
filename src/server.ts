import cors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { CheckInEvent } from "./routes/check-in";
import { createEvent } from "./routes/create-event";
import { getAllAttendeesEvent } from "./routes/get-all-attendees-event";
import { getAllEvents } from "./routes/get-all-events";
import { getAllUsers } from "./routes/get-all-users";
import { getEvent } from "./routes/get-event";
import { getUser } from "./routes/get-user";
import { getUserBadge } from "./routes/get-user-badge";
import { registerEvent } from "./routes/register-event";

const app = Fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "http://localhost:5173", //Use * para axceitar qualquer URL
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Pass.in API",
      description: "Pass.in API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(createEvent);
app.register(registerEvent);
app.register(getEvent);
app.register(getUser);
app.register(getUserBadge);
app.register(CheckInEvent);
app.register(getAllAttendeesEvent);
app.register(getAllUsers);
app.register(getAllEvents);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log({ message: "Seerver is running" });
});
