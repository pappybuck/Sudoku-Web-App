FROM node:18-alpine3.16 AS BUILDER

WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN npm install --omit=dev && npm run build

FROM nginx:1.23.0-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=BUILDER /app/build .

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]