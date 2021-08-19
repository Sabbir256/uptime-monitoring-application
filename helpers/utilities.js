/*
* Title: Utilities
* Description: Impoprtant Utilities function
* Author: Md. Sabbir Ahmed
* Date: 09/08/2021
*/

//dependencies
const crypto = require('crypto');
const environment = require('./environments');


// module scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString)=>{
    let output;

    try{
        output = JSON.parse(jsonString);
    }catch{
        output = {};
    }

    return output;
}

// hast string
utilities.hash = (str)=>{
    if(typeof(str)=='string' && str.length > 0){
        let hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex');

        return hash;
    }
    else{
        return false;
    }
}

// create random string
utilities.createRandomString = (strLength)=>{
    let length = strLength;
    length = typeof(strLength) == 'number' && strLength > 0 ? strLength: false;

    if(length){
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz123456789';
        let output  = '';

        for(let i=1; i<= length; i+=1){
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }

        return output;

    }else{  
        return false;
    }
}



// export module
module.exports = utilities;