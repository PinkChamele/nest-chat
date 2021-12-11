# A Chat

A simple chat app for sharing ideas, intensive discussions of provocative topics, furious fights or posting claims with no proof whatsoever.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes:
### Requirements
- node `16.3.0`
- npm `7.11.1`
- docker or local MongoDB or remote MongoDB credentials
- SendGrid credentials (or any other mailer service/account)
### Set up
- install all requirements
- if using local or dockerized MongoDB - start it (you can use `docker-compose`)
- run `npm ci` or `npm i`

### How to use
Run `npm start` to start the server.
Run `npm run:dev` to launch the server with nodemon.

The user needs to sign up using a username and an email. The email can be used to reset user's password.
 
The chat is organized in "rooms", every room is publicly visible on the "join room" page, and everyone can join any room as well as create a new one.

You can switch between your rooms using the list displayed on the left. When a room is selected you can see all old messages of this room, and receive/send new ones in real time.

## Built with

* [Node 16.3.0](https://nodejs.org/) - Server-side environment for ECMAscript
* [Nest 8.0.2](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
* [MongoDB](https://www.mongodb.com/) - A document-oriented database, accessed using [Mongoose](https://mongoosejs.com/) for node.
