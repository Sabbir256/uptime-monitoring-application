/*
* Title: Server Library
* Description: Server related files
* Author: Md. Sabbir Ahmed
* Date: 19-08-2021
*/

// dependencies
const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');


// server object - module scaffolding
const server = {};


// create server
server.createTheServer = ()=>{
    const startServer = http.createServer(server.handleReqRes);
    startServer.listen(environment.port, ()=>{
        console.log("Listening to port", environment.port);
    });
}

// handle request and response
server.handleReqRes = handleReqRes;


// start the server
server.init = ()=>{
    server.createTheServer();
}

module.exports = server;