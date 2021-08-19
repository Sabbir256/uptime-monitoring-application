/*
* Title: Environments
* Description: Handle all environment related things
* Author: Md. Sabbir Ahmed
* Date: 09/08/2021
*/

//dependencies


// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'forStaging',
    maxChecks: 5,
    twilio: {
        fromPhone: '+17249939566',
        accountSid: 'ACb9d3eab492193bbea5818abc4675f7c8',
        authToken: '8e726400bcc28e74e3e996357845fb5b'
    }
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'forProduction',
    maxChecks: 5,
    twilio: {
        fromPhone: '+17249939566',
        accountSid: 'ACb9d3eab492193bbea5818abc4675f7c8',
        authToken: '8e726400bcc28e74e3e996357845fb5b'
    }
}

// determine which environement was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export correspondingg environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// export module
module.exports = environmentToExport;