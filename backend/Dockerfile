FROM node:22-alpine3.19 AS base
RUN apk add --no-cache libc6-compat bash python3 build-base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
CMD ["npm", "run", "start"]