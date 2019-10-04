const express = require('express');
const helmet = require('helmet');

//router

const server = express();

server.use(helmet())
server.use(express.json())

//server.use('api', router)



module.exports = server;