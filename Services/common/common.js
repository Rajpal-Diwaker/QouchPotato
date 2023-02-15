

//let postDAO = require('../../DAO/postDAO');
let util = require('../../Utilities/util');
//var FCM = require('fcm-node');
// $ npm install fcm-node

module.exports = (() => {

    return {
        /**
         * @method checkBodyData validate all POST request fields 
         * @param {array} Arr
         * @param {object} req
         * @return {str / json} "VALID" / "JSON"
         */
        checkBodyData: (Arr, data) => {
            let promise = new Promise((resolve, reject) => {

                if (Arr.length > 0) {
                    //console.log('promise');
                    for (var i = 0; i < Arr.length; i++) {

                        if (data[Arr[i]]) {
                            if (i == Arr.length - 1) {
                                //console.log('promise');
                                //console.log(i);
                                resolve({
                                    "errtext": "VALID"
                                })
                            }
                        } else {
                            reject({
                                "statusCode": 404,
                                "statusMessage": "Parameter Missing",
                                "parameter_name": Arr[i]
                            });
                        }
                    }
                } else {
                    //console.log('promise no');
                    resolve({
                        "errtext": "VALID"
                    })
                }
            });
            return promise;
        },
        /**
         * @method checkQueryData validate all GET request fields
         * @param {array} Arr
         * @param {object} req
         * @return {str / json} "VALID" / "JSON"
         */
        checkQueryData: (Arr, req) => {
            /* check given parameters using promise */
            let promise = new Promise((resolve, reject) => {
                if (Arr.length > 0) {
                    for (let i = 0; i < Arr.length; i++) {
                        if (req.query[Arr[i]]) {
                            if (i == Arr.length - 1) {
                                resolve({
                                    "errtext": "VALID"
                                });
                            }
                        } else {
                            reject({
                                "status": 404,
                                "message": "Parameter Missing",
                                "parameter_name": Arr[i]
                            });
                        }
                    }
                } else {
                    resolve({
                        "errtext": "VALID"
                    });
                }
            });
            return promise;
        },
        /**
         * @method getUserDesignation get user exp response
         * @param {object} criteria //request
         * @param {object} cb //callback
         * @return {obj} //return user exp
         */
        // getUserDesignation : (criteria, cb) => {
        //     postDAO.getDesignationForPost(criteria, (err, dbSubData) => {
        //         //console.log(dbSubData[0]); return false;
        //         if (err) {
        //             cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        //         }
        //         cb(null, dbSubData[0]);
        //     })
        // },


        /**
         * @method sendNotification to send push notification
         * @param {object} data //request
         * @param {object} cb //callback
         * @return {obj} //return user exp
         */ 
        // sendNotification : (Arr) => {
            
        //     console.log('Notification start');
        //     var serverKey = 'AAAAuVdbVgY:APA91bELppwzoZyYEaFTcfLEX9ZZmgDzhB-81ntM_OdNcZdOinJ8OUKBfcdwJ0uF6EsY_-8cRIwrV2sOTzEo-__rYrh3dLIrHB2G-aV0MSJp1r1yiIaW3VOCmHLyV1P1TGH4iq2bS744';//util.notificationAppKey(); //put your server key here
        //     var fcm = new FCM(serverKey);
         
        //     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        //         to: Arr.deviceId, //device token
        //         collapse_key: 'your_collapse_key',
                
        //         notification: {
        //             title: Arr.payload.title,   
        //             body: Arr.payload.message,
        //             data: Arr.payload.data,
        //             message: Arr.payload.message,
        //             type: Arr.messageType,
        //             click_action: "fcm.ACTION.HELLO"
        //         },
        //         data: {  //you can send only notification or only data(or include both)
        //             message: Arr.payload.message,
        //             type: Arr.messageType,
        //             title: Arr.payload.title,
        //             data: Arr.payload.data
        //         }
        //     };
        //     //console.log(message);
        //     if(Arr.deviceType == "ios"){
        //        delete  message.data;
        //     }else if(Arr.deviceType == "android"){
        //         delete  message.notification;
        //     }
        //     console.log(message);
        //     fcm.send(message, function(err, response){
        //         if (err) {
        //             console.log("Something has gone wrong!", err);
        //         } else {
        //             console.log("Successfully sent with response: ", response); 
        //             //cb(null, true);
        //         }
        //     });
        // }
    }
})();