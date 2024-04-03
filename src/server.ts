import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { getEvent } from "./routes/get-event";
import { getUser } from "./routes/get-user";
import { registerEvent } from "./routes/register-event";

const app = Fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerEvent);
app.register(getEvent);
app.register(getUser);

app.listen({ port: 3333 }).then(() => {
  console.log({ message: "Seerver is running" });
});
