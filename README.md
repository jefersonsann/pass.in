# PASS.IN (NLW rocketseat)

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [x] Criar eventos
- [x] Cadastrar usuário ao evento
- [x] Caso usuário não exista crie um novo usuário e cadastreio no evento
- [ ] Tarefa 4
- [ ] Tarefa 5

## 🚀 Instalando PASS.IN

Para instalar o PASS.IN, siga estas etapas:

##### Start node.js:

```
npm init -y
```

##### Intalando Fastify e Zod:

```
npm i fastify zod
```

##### Instalando typescrypt, prisma e tsx como ambiente de desenvolvimento:

```
npm i typescript @types/node tsx prisma -D
```

##### Iniciando config do typescript:

```
npx tsc --init
```

##### Script do package.json:

```
dev": "tsx watch --env-file .env src/server.ts"
```

##### Inicializando servidor SQLite(ambiente na propria maquina):

```
npx prisma init --datasource-provider SQLite
```
