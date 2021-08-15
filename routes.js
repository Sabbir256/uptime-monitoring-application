/*
* Title: Routes
* Description: Application Routes
* Author: Md. Sabbir Ahmed
* Date: 09/08-2021
*/

//dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;