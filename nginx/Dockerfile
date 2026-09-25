FROM node:alpine AS builder

WORKDIR /app

COPY frontend/package.json .

COPY frontend/package-lock.json .

RUN npm ci

COPY frontend/. .

RUN npm run build

FROM nginx:1.31.6-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/default.conf /ect/ngninx/conf.d/default.conf

EXPOSE 80