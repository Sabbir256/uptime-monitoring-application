// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// based directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.baseDir+'/'+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2)=>{
                if(!err2){
                    fs.close(fileDescriptor, (err3)=>{
                        if(!err3){
                            callback(false);
                        }
                        else{
                            callback("Error closing the file");
                        }
                    })
                }else{
                    callback('Error writing to new file!');
                }
            });
        }else{
            callback("Error: File may already exist!");
        }
    });
};

// read data from file
lib.read = (dir, file, callback)=>{
    fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf-8', (err, data)=>{
        callback(err, data);
    });
};

// update existing file
lib.update = (dir, file, data, callback)=>{
    // open the file for writing
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err2) =>{
                if(!err2){
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err3)=>{
                        if(!err3){
                            // close the file
                            fs.close(fileDescriptor, (err4)=>{
                                if(!err4){
                                    callback(false);
                                }else{
                                    callback("Error closing the file");
                                }
                            });

                        }else{
                            callback("Error writing to the file");
                        }
                    });
                }else{
                    callback('Error truncating the file');
                }
            });

        }else{
            callback('Error updating: File may not exist!');
        }
    });
};

//delete existing file
lib.delete = (dir, file, callback) =>{
    //unlink file
    fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, (err)=>{
        if(!err){
            callback(false);
        }
        else{
            callback("Error deleting the file.");
        }
    });
}

// export the module
module.exports = lib;