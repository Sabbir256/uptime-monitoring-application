/*
* Title: Uptime Monitoring Application
* Description: A RESTFul API to monitor up or down time of user defined links
* Author: Md. Sabbir Ahmed
* Date: 09/08-2021
*/

// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};


// create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, ()=>{
        console.log('Environment variable is:', process.env.NODE_ENV);
        console.log("Listening to port", app.config.port);
    });
}

// handle request and response
app.handleReqRes = handleReqRes;


// start the server
app.createServer();