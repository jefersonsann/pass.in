import cors from "@fastify/cors";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { CheckInEvent } from "./routes/check-in";
import { createEvent } from "./routes/create-event";
import { getAllAttendeesEvent } from "./routes/get-all-attendees-event";
import { getEvent } from "./routes/get-event";
import { getUser } from "./routes/get-user";
import { getUserBadge } from "./routes/get-user-badge";
import { registerEvent } from "./routes/register-event";

const app = Fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "http://localhost:3000", //Use * para axceitar qualquer URL
});

app.register(createEvent);
app.register(registerEvent);
app.register(getEvent);
app.register(getUser);
app.register(getUserBadge);
app.register(CheckInEvent);
app.register(getAllAttendeesEvent);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log({ message: "Seerver is running" });
});
