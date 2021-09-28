# FROM node:16.3.0-alpine
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production
# RUN npm rebuild bcrypt --build-from-source && \
# npm install -g node-gyp && \
# npm install -g @nestjs/cli
# COPY . .
# EXPOSE 3000
# RUN chown -R node /usr/src/app
# USER node
# CMD ["npm", "start"]

FROM node:16

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start"]