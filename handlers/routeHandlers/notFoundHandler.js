/*
* Title: Not Found Handler
* Description: 404 Not Found Handler
* Author: Md. Sabbir Ahmed
* Date: 09/08-2021
*/

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback)=>{
    callback(404, {
        message: 'Your requested url was not found',
    });
};

module.exports = handler;