FROM node:22.14.0-alpine3.21 AS builder
WORKDIR /app
COPY --from=client package*.json .
RUN npm install
COPY --from=client . .
RUN npm run build

FROM nginx:1.27.4-alpine3.21
COPY --from=nginx-templates . /etc/nginx/templates
COPY --from=builder /app/dist/angular_course_work/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
