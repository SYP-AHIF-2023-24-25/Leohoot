FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY static-files /usr/share/nginx/html/images

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
