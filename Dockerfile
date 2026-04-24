FROM node:20-slim

WORKDIR /app

# Instalar OpenSSL necessário para Prisma
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copiar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Expor porta
EXPOSE 3000

# Rodar aplicação standalone
CMD ["node", ".next/standalone/server.js"]

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".next/standalone/server.js"]
