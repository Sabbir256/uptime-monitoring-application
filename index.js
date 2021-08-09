/*
* Title: Uptime Monitoring Application
* Description: A RESTFul API to monitor up or down time of user defined links
* Author: Md. Sabbir Ahmed
* Date: 09/08-2021
*/

// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const environmentToExport = require('./helpers/environments');

// app object - module scaffolding
const app = {};


// create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, ()=>{
        console.log("Listening to port", environment.port);
    });
}

// handle request and response
app.handleReqRes = handleReqRes;


// start the server
app.createServer();