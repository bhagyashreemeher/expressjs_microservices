# ExpressJS Microservices

Microservices built using ExpressJS and MongoDB.

### Tech

It uses a number of open source projects to work properly:

* [Mongoose](https://mongoosejs.com/) - elegant mongodb object modeling for node.js
* [node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](http://expressjs.com/) - fast node.js network app framework

### Installation

It requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd expressjs_microservices
$ npm install
```
To setup mongodb database in local:

Add LOCALDBURL env variable

```sh
$ export LOCALDBURL="mongodb://localhost:27017/node-api"
```

To run locally:

```sh
$ npm run dev
```

To generate build and start the server:

```sh
$ npm run build
$ npm run start
```

To check the code quality using eslint:

```sh
$ npm run lint
```