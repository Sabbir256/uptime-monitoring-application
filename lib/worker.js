/*
* Title: Worker library
* Description: worker related files
* Author: Md. Sabbir Ahmed
* Date: 19-08-2021
*/

// dependencies
const data = require('./data');
const {parseJSON} = require('../helpers/utilities');
const url = require('url');
const http = require('http');
const https = require('https');
const { runInNewContext } = require('vm');
const {sendTwilioSms} = require('../helpers/notifications');


// worker object - module scaffolding
const worker = {};

// lookup all the checks from database
worker.gatherAllChecks = ()=>{
    // get all the checks
    data.list('checks', (err, checks) => {
        if(!err && checks && checks.length > 0){
            checks.forEach( check=>{
                // read the checkData
                data.read('checks', check, (err2, originalCheckData)=>{
                    if(!err2 && originalCheckData){
                        // pass the data to the check validatot
                        worker.validateCheckData(parseJSON(originalCheckData));


                    }else{
                        console.log(`Error: reading this ${check} check data.`);
                    }
                });
            });
        }else{
            console.log("Error: could not find any checks to process");
        }
    })
}

// validate check data
worker.validateCheckData = (checkData)=>{
    let originalCheckData = checkData;

    if(originalCheckData && originalCheckData.id){

        originalCheckData.state = typeof(originalCheckData.state) == ['string'] && ['up', 'down'].indexOf(originalCheckData) > -1 ? originalCheckData.state: 'down';

        originalCheckData.lastChecked = typeof originalCheckData.lastChecked == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;


        // pass to the next process
        worker.performCheck(originalCheckData);

    }else{
        console.log("Error: Check is invalid or not properly formatted!");
    }
}

// perform check
worker.performCheck = (originalCheckData)=>{
    // prepare the initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode':false
    };
    // mark the outcome has not been sent yet
    let outcomeSent = false;


    // parse the hostname & full url from original data
    const parsedUrl = url.parse(originalCheckData.protocol+'://' + originalCheckData.url, true);

    let hostname = parsedUrl.hostname;
    const path = parsedUrl.path;
    
    // cosntruct the request
    const requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'hostname': hostname,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000,
    };

    const protocolToUse = originalCheckData.protocol == 'http' ? http: https;

    let req = protocolToUse.request(requestDetails, (res)=>{
        // grab the status of the response
        const status = res.statusCode;

        checkOutcome.responseCode = status;
        // update the check outcome and pass to the next process
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (e)=>{
        checkOutcome = {
            'error': true,
            'value': e
        };
        // update the check outcome and pass to the next process
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', ()=>{
        checkOutcome = {
            'error': true,
            'value': 'timeout'
        };
        // update the check outcome and pass to the next process
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // send the request
    req.end();
};

// save check outcome to database
worker.processCheckOutcome = (originalCheckData, checkOutcome)=>{
    // check if check outcome is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

    // decide whether to alert the user or not
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state != state ? true: false;

    // update the check data
    let newCheckdata = originalCheckData;
    newCheckdata.state = state;
    newCheckdata.lastChecked = Date.now();

    // save to dist
    data.update('checks', newCheckdata.id, newCheckdata, (err)=>{
        if(!err){
            if(alertWanted){
                // send the check dat to next process
                worker.alertUserToStatusChange(newCheckdata);
            }
            else{
                console.log(`Alert is not needed`);
            }
            // alert is not wanted if no status change
        }else{
            console.log("Error: trying to save check data!");
        }
    })
}

worker.alertUserToStatusChange = (newCheckdata)=>{
    let msg = `Alert: Your check for ${newCheckdata.method.toUpperCase()} ${newCheckdata.protocol}://${newCheckdata.url} is currently ${newCheckdata.state}`;

    sendTwilioSms(newCheckdata.userPhone, msg, (e)=>{
        if(!e){
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        }else{
            console.log(`Error: ${e}`);
        }
    })

};



// timer to execute the worker process once per minute
worker.loop = ()=>{
    setInterval(()=>{
        worker.gatherAllChecks();
    }, 1000*60);
}



// start the worker
worker.init = ()=>{
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
};

module.exports = worker;