# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn

# Install dotenv on /bin
# RUN npm install -g dotenv-cli

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npx prisma generate
RUN npx nest build

RUN cp src/*.txt .

# Remove src
RUN rm -rf src

# USER node

ENV HOST 0.0.0.0

# Start the server using the production build
CMD [ "yarn", "run:stage:docker" ]