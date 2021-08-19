/*
* Title: Project Initial File
* Description: Initial file to start the node server and workers
* Author: Md. Sabbir Ahmed
* Date: 09-08-2021
*/

// dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// app object - module scaffolding
const app = {};


app.init = ()=>{
    // start the server
    server.init();

    // start the worker
    worker.init();
}

// run the app
app.init();