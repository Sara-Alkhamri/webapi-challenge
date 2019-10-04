const express = require('express');
const helmet = require('helmet');

//router
const projectRouter = require('./data/projectRouter');

const server = express();

server.use(helmet())
server.use(express.json())
server.use(logger);

//server.use('api', router)
server.use('api/projects', projectRouter);

function logger(req, res, next) {
    console.log(req.method, req.url, Date.now())
    next();
  };
  
module.exports = server;