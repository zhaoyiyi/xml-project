FROM node:10-alpine
ENV PORT=${PORT}
WORKDIR /app
COPY . .
RUN npm install
CMD npm run start