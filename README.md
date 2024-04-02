npm init -y

npm i fastify zod
npm i typescript @types/node tsx prisma -D

npx tsc --init

- "dev": "tsx watch --env-file .env src/server.ts"

npx prisma init --datasource-provider SQLite
