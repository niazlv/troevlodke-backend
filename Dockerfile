FROM node:16.15

WORKDIR /app

COPY package*.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN npx prisma generate
RUN npx nest build
RUN rm -rf src

ENV HOST 0.0.0.0

CMD [ "yarn", "run:stage" ]