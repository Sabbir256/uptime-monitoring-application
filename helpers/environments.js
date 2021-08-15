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
    secretKey: 'forStaging'
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'forProduction'
}

// determine which environement was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export correspondingg environment object
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// export module
module.exports = environmentToExport;