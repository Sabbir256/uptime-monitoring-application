/*
* Title: Handle Request Response
* Description: Handle request and response
* Author: Md. Sabbir Ahmed
* Date: 09/08-2021
*/

// dependencies
const {StringDecoder} = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');
const {parseJSON} = require('./utilities');

// module scaffording

const handler = {};

handler.handleReqRes = (req, res) => {

    /* ** handle requests ** */

    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase(); // GET -> get
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    // console.log(trimmedPath);

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath]? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer)=>{
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);
        
        chosenHandler(requestProperties, (statusCode, payload)=>{
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload: {};
    
            const payloadString = JSON.stringify(payload);
    
            // return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
    
        });

        // res.end("Hello World");
    });
}


module.exports = handler;