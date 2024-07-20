# Development stage
FROM node:22 as dev
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD ["yarn", "start:dev"]

EXPOSE 3000

# Production stage
FROM node:22-alpine as prod
WORKDIR /app
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/node_modules ./node_modules
COPY package.json .
CMD ["node", "dist/main"]

EXPOSE 3000
