let async = require('async'),
    queryString = require('querystring');

let util = require('../Utilities/util'),
    chatDAO = require('../DAO/chatDAO'),
    VALIDATE = require('./common/common');


/*--API METHOD--*/

//user chat home
let chatHome = (data,callback) => {
    console.log(data);
    //data.api_token = api_token;
    let Arr = ['userId'];
    VALIDATE.checkBodyData(Arr, data).then((reqData) => {
        if (reqData.errtext == "VALID") {
            async.auto({
                chat : (cb) => {
                    let criteria = {
                        userId : data.userId,
                    }
                    chatDAO.getHomeData(criteria, (err, response) => {
                        console.log(response);
                        if(err){ 
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                        response.map(function(v, i){
                            //console.log(v);
                            //console.log(i);
                            if(response[i].profilePicture){
                                response[i].profilePicture = response[i].profilePicture;  
                            }else{
                                response[i].profilePicture = "";
                            }
                        });
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.SUCCESS, 'result': response });
                            return;
                    });
                }
            }, (err, response) => {
                callback(response.chat);
            })
        }
    }, (err) => {
        callback(err);
    });
}

//user can get chat message here
let getChatMessage = (data, callback) => {
    console.log(data);
    //data.api_token = api_token;
    let Arr = ['sender_id', 'receiver_id'];
    VALIDATE.checkBodyData(Arr, data).then((reqData) => {
        if (reqData.errtext == "VALID") {
            async.auto({
                chat : (cb) => {
                    let criteria = {
                        sender_id : data.sender_id,
                        receiver_id : data.receiver_id,
                       
                    }
                    chatDAO.chatGet(criteria, (err, response) => {
                        //console.log(response);
                        if(err){ 
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                        response.map(function(v, i){
                            //console.log(v);
                            //console.log(i);
                            if(response[i].profilePicture){
                                response[i].profilePicture =  response[i].profilePicture;  
                            }else{
                                response[i].profilePicture = "";
                            }
                        });
                        //blockStatus = {}
                        
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.SUCCESS, 'result': response });
                            return;
                    });
                }
            }, (err, response) => {
                callback(response.chat);
            })
        }
    }, (err) => {
        callback(err);
    });
}


module.exports = {
    chatHome: chatHome,
    getChatMessage: getChatMessage,
}
