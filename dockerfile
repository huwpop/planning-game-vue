FROM node:16-alpine as planning-game

WORKDIR /usr/src/app
ENV PORT 3000


WORKDIR /app
COPY . /app/

FROM planning-game as build-app
WORKDIR /app/client
RUN npm install
RUN npm run build

FROM planning-game as server
COPY --from=build-app /app/client/dist /app/server/dist
WORKDIR /app/server
RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "start"]