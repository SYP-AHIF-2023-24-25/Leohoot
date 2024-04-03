FROM node:18 AS builder
WORKDIR /app
COPY ./package*.json .
RUN npm install -g @angular/cli@17.2.1 && npm install
COPY . .
RUN ng build --configuration=production

FROM nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/leohoot .