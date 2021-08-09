/*
* Title: Routes
* Description: Application Routes
* Author: Md. Sabbir Ahmed
* Date: 09/08-2021
*/

//dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
};

module.exports = routes;