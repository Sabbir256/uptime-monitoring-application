/*
* Title: User Handler
* Description: Sample Handler
* Author: Md. Sabbir Ahmed
* Date: 15-08-2021
*/

// dependencies
const data = require('../../lib/data');
const {hash, parseJSON} = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._users[requestProperties.method](requestProperties, callback);

    }else{
        callback(405);

    }    
};

//module scaffolding to keep the main function complexity free
handler._users = {};

handler._users.post = (requestProperties, callback)=>{
    const firstName = 
        typeof(requestProperties.body.firstName)== 'string' && 
        requestProperties.body.firstName.trim().length > 0 
            ? requestProperties.body.firstName
            : false;

    const lastName = 
        typeof(requestProperties.body.lastName)== 'string' && requestProperties.body.lastName.trim().length > 0 
            ? requestProperties.body.lastName 
            : false;

    const phone = 
        typeof(requestProperties.body.phone)== 'string' && requestProperties.body.phone.trim().length == 11 
            ? requestProperties.body.phone 
            : false;

    const password = 
        typeof(requestProperties.body.password)== 'string' && requestProperties.body.password.trim().length > 0 
            ? requestProperties.body.password 
            : false;

    const tosAgreement = 
        typeof(requestProperties.body.tosAgreement)== 'boolean' && requestProperties.body.tosAgreement 
            ? requestProperties.body.tosAgreement 
            : false;

    if(firstName && lastName && phone && password && tosAgreement){
        // make sure that the user does not already exits
        data.read('users', phone, (err, user)=>{
            if(err){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store the user to db
                data.create('users', phone, userObject, (err2)=>{
                    if(!err2){
                        callback(200,{
                            message: 'User was created successfully!',
                        });

                    }else{
                        callback(500, {
                            error: 'Could not create user!'
                        });
                    }
                });

            }else{
                callback(500, {
                    error: 'There was a problem at server side',
                });
            }
        })
    }else{
        callback(400,{
            error: 'You have a problem in your request',
        });
    }

}

//@TODO: authentication
handler._users.get = (requestProperties, callback)=>{
    // check if the phone number is valid
    const phone = 
        typeof(requestProperties.queryStringObject.phone)== 'string' && requestProperties.queryStringObject.phone.trim().length == 11 
            ? requestProperties.body.phone 
            : false;

    if(phone){
        // look up the user
        data.read('users', phone, (err, userData)=>{
            const user = {...parseJSON(userData)}; // spread operator is used
            
            if(!err && user){
                delete user.password; // we wont give the password
                callback(200, user);
            }else{
                callback(404, {
                    error: 'Requested user was not found!'
                });
            }
        });
    }else{
        callback(404, {
            error: 'Requested user was not found!'
        });
    }
}

//@TODO: authentication
handler._users.put = (requestProperties, callback)=>{
    const phone = 
    typeof(requestProperties.body.phone)== 'string' && requestProperties.body.phone.trim().length == 11 
        ? requestProperties.body.phone 
        : false;

        const firstName = 
        typeof(requestProperties.body.firstName)== 'string' && 
        requestProperties.body.firstName.trim().length > 0 
            ? requestProperties.body.firstName
            : false;

    const lastName = 
        typeof(requestProperties.body.lastName)== 'string' && requestProperties.body.lastName.trim().length > 0 
            ? requestProperties.body.lastName 
            : false;

    const password = 
        typeof(requestProperties.body.password)== 'string' && requestProperties.body.password.trim().length > 0 
            ? requestProperties.body.password 
            : false;

    if(phone){
        if(firstName||lastName||password){
            //lookup the user
            data.read('users', phone, (err, user)=>{
                const userData = { ...parseJSON(user) };

                if(!err && data){
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(lastName){
                        userData.lastName = lastName;
                    }
                    if(password){
                        userData.password = hash(password);
                    }

                    // store to database
                    data.update('users', phone, userData, (err2)=>{
                        if(!err2){
                            callback(200, {
                                message: 'User was updated successfully!',
                            })

                        }else{
                            callback(500, {
                                error: 'There was a problem in the server side!'
                            })
                        }
                    });
                }else{
                    callback(400,{
                        error: 'Error Reading data from file!',
                    });
                }
            });
        }else{
            callback(400,{
                error: 'You have a problem in your request!',
            });
        }

    }else{
        callback(400, {
            error: 'Invalid phone number. Please try again!'
        });
    }
     
}

//@TODO: authentication
handler._users.delete = (requestProperties, callback)=>{
    const phone = 
        typeof(requestProperties.queryStringObject.phone)== 'string' && requestProperties.queryStringObject.phone.trim().length == 11 
            ? requestProperties.body.phone 
            : false;

    if(phone){
        // lookup the file
        data.read('users', phone, (err, userData)=>{
            if(!err && userData){
                data.delete('users', phone, (err2)=>{
                    if(!err2){
                        callback(200, {
                            message: 'User was successfully deleted',
                        });
                    }else{
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                })
            }else{
                callback(500, {
                    error: 'There was a server side error!',
                });
            }
        });
    }else{
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
}

module.exports = handler;