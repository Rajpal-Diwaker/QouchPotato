/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: 13/12/2018
*/

let async = require('async'),
    queryString = require('querystring');

let util = require('../Utilities/util'),
    userDAO = require('../DAO/userDAO');
var Client = require('node-rest-client').Client;
var client = new Client();
//var brain = require('brainjs');



// user signup 
let signup = (data, callback) => {
    // console.log(data, "Ambuj")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                email: data.email
            }
            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                }
                if (dbData && dbData.length) {

                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.USER_EXISTS });
                    return;
                } else {
                    cb(null)

                }
            });
        },
        createUserinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            let token = util.generateToken();
            let dataToSet = {
                "userName": (data.userName) ? data.userName : "",
                "password": util.encryptData(data.password),
                "email": data.email,
                "facebook_id": data.facebook_id ? data.facebook_id : '',
                "google_id": data.google_id ? data.google_id : '',
                "api_token": token,
                "login_status": "1"
            }
            userDAO.createUser(dataToSet, (err, dbData) => {
                //   console.log(err, "Ambuj")

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                }
                var criteria = {
                    email: data.email
                }
                userDAO.getUsers(criteria, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                        return;
                    }
                    // dataToSet = {
                    //     "userId": dbData[0].userId,
                    //     "genre": data.genre ? data.genre : ""
                    // }
                    // userDAO.addUserGenre(dataToSet, (err, dbData) => {
                    //     //  console.log(dataToSet,"post")
                    //     // cb(null)
                    // });
                    if (dbData && dbData.length) {
                        //sconsole.log(dbData,"8888")
                        var obj = {};

                        var criteria = {
                            "userId": dbData[0].userId,
                        }

                        userDAO.getUserGener(criteria, (err, genreData) => {

                            obj.userId = dbData[0].userId.toString();
                            obj.email = dbData[0].email;
                            obj.facebook_id = dbData[0].facebook_id;
                            obj.google_id = dbData[0].google_id;
                            obj.api_token = dbData[0].api_token;
                            obj.login_status = dbData[0].login_status;
                            //obj.genre = genreData[0].genre;

                            console.log(dbData[0], "8098090")
                            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.USER_ADDED, "result": obj });
                            return;



                        })




                    }
                });

                //cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.USER_ADDED,"result":dataToSet});

            });
        }]
    }, (err, response) => {
        callback(response.createUserinDB);
    });
}

// user login
let login = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            if (!data.email || !data.password) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                email: data.email,
            }
            userDAO.getUsers(criteria, (err, dbData) => {

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                }

                if (dbData && !dbData.length) {

                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": "User does not exist" });
                    return;


                } else {
                    var criteria = {
                        email: data.email,
                        password: util.encryptData(data.password)
                    }
                    userDAO.getUsers(criteria, (err2, dbData2) => {
                        if (err2) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                        }
                        if (dbData2 && !dbData2.length) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": "Please enter correct password" });
                            return;
                        } if (dbData && dbData[0].accountStatus == "deactive") {
                            // console.log(dbData[0].accountStatus,"Test")
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": "User account has been deactivated" });
                            return
                        } else {
                            if (dbData && dbData.length) {
                                console.log(dbData, "post")
                                if (dbData[0].location == 0) {
                                    dbData[0].userId = dbData[0].userId.toString();
                                    cb(null, { "statusCode": util.statusCode.TWO_ZERO_TWO, "statusMessage": util.statusMessage.COMPLETE, result: dbData[0] });
                                    return;
                                }
                            }
                            if (dbData && dbData.length) {
                                dbData[0].userId = dbData[0].userId.toString();

                                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGIN_SUCCESS, result: dbData[0] });

                                var criteria = {
                                    email: dbData[0].email
                                }
                                var dataToSet = {
                                    "profileStatus": "1",
                                    "login_status": "1"
                                }
                                userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                                    if (err) {
                                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                                        return;
                                    }
                                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.STATUS_UPDATED });
                                    return;
                                })
                            }
                        }
                    })
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// update user status
let updateStatus = (data, token, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email || !token) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                email: data.email
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                console.log(dbData);
                if (dbData && dbData.length == 0) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INCORRECT_EMAIL });
                    return;
                }
                if (dbData && dbData.length) {
                    if (token != dbData[0].token) {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INVALID_TOKEN });
                        return;
                    }
                    cb(null);
                }
            });

            // code to validate token.....
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                email: data.email
            }
            var dataToSet = {
                "profileStatus": data.profileStatus
            }
            userDAO.updateUser(criteria, dataToSet, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.STATUS_UPDATED });
                return;

            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })


}

// complete user profile
let completeProfile = (data, files, callback) => {
    // console.log(data, "data Test")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                // console.log(dbData, "Get user Data")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {

                    let criteria = {
                        userName: data.userName
                    }
                    userDAO.getUsers(criteria, (err, dbData2) => {
                        //console.log(criteria, "Ambuj")
                        if (dbData2 && dbData2.length > 0) {
                            cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.USERNAME });
                            return;
                        }
                        else {
                            cb(null);
                        }
                    })

                }
                // if(dbData && dbData.length == 0){
                //     cb(null,{"statusCode":util.statusCode.FOUR_ZERO_ONE,"statusMessage":util.statusMessage.USER_NOT_FOUND});
                //     return;
                // }
                // // if(dbData && dbData.length){
                // //     if(token != dbData[0].token){
                // //         cb(null,{"statusCode":util.statusCode.BAD_REQUEST,"statusMessage":util.statusMessage.INVALID_TOKEN});
                // //         return;
                // //     }
                // cb(null);
                // }
            });

            // code to validate token.....
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                userId: data.userId
            }
            let profile_image;

            if (files && files.profilePicture && files.profilePicture[0].filename && files.profilePicture[0].size > 0) {
                profile_image = files.profilePicture[0].filename;
            }
            var dataToSet = {
                "userName": data.userName,
                "location": data.location,
                "gender": data.gender,
                "age": data.age,
                "des": (data.des) ? data.des : ' ',
                "genre": data.genre ? data.genre : ""

            }

            if (profile_image && profile_image != "") {
                dataToSet.profilePicture = profile_image
            }
            //console.log(dataToSet, "Check Image")
            userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                //  console.log(dataToSet, "rer")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                dataToSet2 = {
                    "userId": data.userId,
                    "genre": data.genre ? data.genre : ""
                }
                userDAO.addUserGenre(dataToSet2, (err, dbData) => {
                    //console.log(dataToSet,"post")
                    // cb(null)
                });
                // var criteria = {
                //     userId: data.userId
                // }
                // userDAO.getUsers(criteria, (err, dbData) => {
                //     if (err) { 
                //         cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR})
                //         return;
                //     }

                //     if (dbData && dbData.length) {
                //         dbData[0].userId = dbData[0].userId.toString();
                //         dbData[0].age = dbData[0].age.toString();
                //         cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.STATUS_UPDATED,"result":dbData[0]});                    
                //         return;
                //     }
                // });

                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.STATUS_UPDATED, "result": dataToSet });


            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })


}

let getFollower = (criteria, cb) => {
    userDAO.getFollower(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

let getFollowed = (criteria, cb) => {
    userDAO.getFollowed(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

let getuser = (criteria, cb) => {
    userDAO.getUsers(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

let getUserPost = (criteria, cb) => {
    userDAO.getPost(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

let getUserProfile = (data, callback) => {
    async.parallel({
        profile: (cb) => {
            var criteria = {
                userId: data.userId
            }
            getuser(criteria, (err, response) => {
                //  console.log(response, "asasas")
                cb(null, response);
            });
        },
        postData: (cb) => {
            var criteria = {
                userId: data.userId
            }
            getUserPost(criteria, (err, response) => {

                cb(null, response);
            });
        },
        follower: (cb) => {
            var criteria = {
                followerId: data.userId
            }
            getFollower(criteria, (err, response) => {

                cb(null, response);
            });
        },
        followed: (cb) => {
            var criteria = {
                followedId: data.userId
            }
            getFollowed(criteria, (err, response) => {

                cb(null, response);
            });
        },
    }, (err, response) => {
        // console.log(response, "iiiii")
        // for(i = 0; i<response.length;i++){
        let res1 = {};
        res1.profile = response.profile[0];
        res1.post = response.postData;
        res1.profile.follower = response.follower[0].follower,
            res1.profile.followed = response.followed[0].followed,

            //res1 = res2;
            callback({ "statusCode": util.statusCode.OK, "statusMessage": "User data fetch successfully", "result": res1 });
        //   }


    }),
        (err) => {
            callback(err);
        }
}

// update user profile
let updateProfile = (data, files, callback) => {
    // console.log(data, "data Test")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                //  console.log(dbData, "Get user Data")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                // if(dbData && dbData.length){
                //     cb(null,{"statusCode":util.statusCode.FOUR_ZERO_ONE,"statusMessage":util.statusMessage.USER_NOT_FOUND});
                //     return;
                // }
                cb(null);
            });

            // code to validate token.....
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                userId: data.userId
            }
            let profile_image;

            if (files && files.profilePicture && files.profilePicture[0].filename && files.profilePicture[0].size > 0) {
                profile_image = files.profilePicture[0].filename;
            }
            var dataToSet = {
                "location": data.location,
                "gender": data.gender,
                "age": data.age,
                "des": (data.des) ? data.des : ' ',

            }

            if (profile_image && profile_image != "") {
                dataToSet.profilePicture = profile_image
            }
            // console.log(dataToSet, "Check Image")
            userDAO.updateUsers(criteria, dataToSet, (err, dbData) => {
                //  console.log(dataToSet, "rer")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }

                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.STATUS_UPDATED, "result": dataToSet });


            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })


}

// change password
let changePassword = (data, callback) => {
    //console.log(data, "Ambuj00000")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId || !data.old_password) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId,
                password: util.encryptData(data.old_password)
            }

            userDAO.getUsers(criteria, (err, dbData) => {

                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }

                if (dbData && dbData.length) {
                    cb(null);
                } else {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INCORRECT_PASSWORD });
                }
            });
        },
        updatePasswordInDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB && functionData.checkUserExistsinDB.statusCode) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }

            var criteria = {
                userId: data.userId,
            }
            var dataToSet = {
                "password": util.encryptData(data.new_password),
            }
            userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                // console.log(err, "Ambuj>>>>>>>>>>>...")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }

                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PASSWORD_CHANGED })
            });
        }]
    }, (err, response) => {
        callback(response.updatePasswordInDB);
    });

}

// user logout 
let logOut = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG });
                    return;
                }
                if (dbData && dbData.length == 0) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INCORRECT_EMAIL });
                    return;
                }
                var criteria = {
                    userId: dbData[0].userId
                }
                var dataToSet = {
                    "profileStatus": "0",
                    "device_token": " "
                }
                userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                    //   console.log(dbData, "kdnflsd     ")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG });
                        return;
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGOUT });
                    return;

                })
            });

        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })

}

// login with facebook
let LoginWithFacebook = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.facebook_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }

            var criteria = {
                facebook_id: data.facebook_id
            }
            //console.log(criteria, "check")
            // code to validate existance of customer id in middle ware server...
            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }
                if (dbData && dbData.length) {
                    if (dbData && dbData[0].accountStatus == "deactive") {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": "User account has been deactivated" });
                        return
                    }
                    dbData[0].userId = dbData[0].userId.toString();
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGGED_IN, "result": dbData[0], "user_status": "old" });
                } else {
                    let dataToSet = {
                        "facebook_id": data.facebook_id,
                        // "userName": data.userName?data.userName:'',
                        "email": data.email ? data.email : '',
                        //"api_token": token,
                        "location": data.location ? data.location : '',
                        "gender": data.gender ? data.gender : '',
                        "age": data.age ? data.age : '',
                        "des": data.des ? data.des : '',
                        "login_status": "2",
                    }

                    userDAO.createUser(dataToSet, (err, dbData) => {

                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG });
                            return;
                        }
                        var criteria = {
                            facebook_id: data.facebook_id
                        }
                        userDAO.getUsers(criteria, (err, dbData) => {
                            if (err) {
                                cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                                return;
                            }

                            if (dbData && dbData.length) {
                                dbData[0].userId = dbData[0].userId.toString();

                                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData[0], "user_status": "new" });
                                return;
                            }
                        });
                        // cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData,"user_status":"new"});    
                        // return;
                    });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// login with google
let LoginWithGoogle = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.google_id) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }

            var criteria = {
                google_id: data.google_id
            }
            //console.log(criteria, "check")
            // code to validate existance of customer id in middle ware server...
            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }
                if (dbData && dbData.length) {
                    if (dbData && dbData[0].accountStatus == "deactive") {
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": "User account has been deactivated" });
                        return
                    }
                    dbData[0].userId = dbData[0].userId.toString();
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGGED_IN, "result": dbData[0], "user_status": "old" });
                } else {
                    let dataToSet = {
                        "google_id": data.google_id,
                        // "userName": data.userName?data.userName:'',
                        "email": data.email ? data.email : '',
                        "location": data.location ? data.location : '',
                        "gender": data.gender ? data.gender : '',
                        "age": data.age ? data.age : '',
                        "des": data.des ? data.des : '',
                        "login_status": "2",

                    }

                    userDAO.createUser(dataToSet, (err, dbData) => {

                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG });
                            return;
                        }
                        var criteria = {
                            google_id: data.google_id
                        }
                        userDAO.getUsers(criteria, (err, dbData) => {
                            if (err) {
                                cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                                return;
                            }

                            if (dbData && dbData.length) {
                                dbData[0].userId = dbData[0].userId.toString();
                                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData[0], "user_status": "new" });
                                return;
                            }
                        });
                        // cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dataToSet,"user_status":"new"});    
                        // return;
                    });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// update device token
let updateDevicetoken = (data, callback) => {
    console.log(data,"Test...........")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length == 0) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.USER_NOT_FOUND });
                    return;
                }

                cb(null);
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                userId: data.userId
            }
            var dataToSet = {
                "device_type": data.device_type?data.device_type:'iOS',
                "device_token": data.device_token?data.device_token:' '

            }
            userDAO.updateUserDevicetoken(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DEVICE_tOKEN_UPDATE, "result": dataToSet });


            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })

}

// forgot password
let forgotPassword = (data, callback) => {
    // console.log(data, "Ambuj")
    async.auto({
        checkUserExistsinDB: (cb) => {

            if (!data.email) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                email: data.email
            }
            userDAO.getUsers(criteria, (err, dbData) => {

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                }

                if (dbData && dbData.length) {
                    var forgot_token = util.generateToken();
                    var criteria = {
                        email: data.email
                    }
                    var dataToSet = {
                        "forgot_token": forgot_token
                    }
                    userDAO.updateUser(criteria, dataToSet, {}, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                    })
                    // code to send email...
                    util.sendEmail({ "email": data.email, "forgot_token": forgot_token });
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.EMAIL_SENT });
                } else {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INCORRECT_EMAIL });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// verify forgot link 
let verifyForgotLink = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email || !data.forgot_token) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                return;
            }
            var criteria = {
                email: data.email,
                forgot_token: data.forgot_token

            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ZERO, "statusMessage": util.statusMessage.INTERNAL_SERVER_ERROR })
                }
                if (dbData && dbData.length) {
                    // console.log(dbData, "Done++++")
                    // code to send email...
                    cb(null, { "statusCode": util.statusCode.OK, "email": data.email });
                } else {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.INVALID_REQUEST, email: "" });
                }
            });

            // code to validate token.....
        }

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/* Code to update password from forgot page */
let updateForgotPassword = (data, callback) => {
    // console.log(data, "request came to services");
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email || !data.password) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                email: data.email,
                // status : 1
            }
            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length == 0) {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.INCORRECT_EMAIL });
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PASSWORD_CHANGED });
            });

            // code to validate token.....
        },

        updatePasswordinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);

            }
            var criteria1 = {
                email: data.email
            }
            // console.log(criteria1, "Ambuj999");
            let newToken = util.generateToken();

            var dataToSet = {
                "password": util.encryptData(data.password),
                "emptyToken": "true",
                "api_token": newToken
            }
            //console.log(dataToSet, "jfkjds")
            userDAO.updateUser(criteria1, dataToSet, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                // console.log(dbData, "Ambuj")
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PASSWORD_UPDATED });
                return;

            })
        }]
    }, (err, response) => {
        callback(response.updatePasswordinDB);
    })


}

// user post
let addPost = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null);
                }
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }

            var dataToSet = {
                "userId": data.userId,
                "link": data.link?data.link:'',
                "postThumbnail" : data.postThumbnail?data.postThumbnail:" ",
                "title": data.title,
                "expression_code": data.expression_code,
                "expression": data.expression,
                "platform": data.platform,
                "activity": data.activity ? data.activity : '',

            }
            userDAO.addPost(dataToSet, (err, dbData) => {

                var criteria1 = {
                    "followerId": data.userId,
                }
                userDAO.sentPostToAllUser(criteria1, (err, dbData) => {
                    var criteria = {
                        "userId": data.userId,
                    }
                    userDAO.getUsers(criteria, (err, userData) => {
                        for (i = 0; i < dbData.length; i++) {
                            if (dbData[i].followedId != null) {
                                if (dbData[i].device_token != null) {
                                    let user = {
                                        userId: userData[0].userId.toString(),
                                        userName: userData[0].userName,
                                        profile_picture: userData[0].profilePicture,

                                    };
                                    var options = {
                                        token: {
                                            key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                            keyId: "G6365Q88C7",
                                            teamId: "48CG7UJ7VV"
                                        },
                                        production: false
                                    };
                                    var dataToSet = {
                                        userId : dbData[0].userId.toString(),
                                        title : userData[0].userName.replace(/^./, userData[0].userName[0].toUpperCase()) + " has added a new post",
                                        type: "post"
                                    }
                                    userDAO.userNotification(dataToSet, (err, dbData) => {
                                        //console.log(err,"postttttt")
                                    })
                                    var apnProvider = new apn.Provider(options);
                                    let deviceToken = dbData[i].device_token;

                                    var note = new apn.Notification();
                                    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                    note.badge = 3;
                                    note.sound = "ping.aiff";
                                    note.alert = userData[0].userName.replace(/^./, userData[0].userName[0].toUpperCase()) + " has added a new post";
                                    note.payload = { result: user, type: "post" };
                                    note.topic = "com.qouch.app";

                                    apnProvider.send(note, deviceToken).then((result) => {
                                        console.log(result, "notification send");
                                        console.log(note, "test notification")
                                    });
                                }
                            }

                        }
                    })
                })

                //console.log(dbData, "fdsrtyu")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                var dataToSet = {
                    "postId": dbData.insertId,
                    "genre": data.genre,
                }
                userDAO.addGener(dataToSet, (err, dbData) => {
                    // console.log(dbData, "fdsrtyu")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                    }
                })
                var dataToSet2 = {
                    "postId": dbData.insertId,
                    "hashtags": (data.hashtags) ? data.hashtags + "," : "",
                }
                userDAO.addHashTag(dataToSet2, (err, dbData) => {
                    // console.log(dbData, "fdsrtyu")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                    }
                })
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Post created Successfully" });
            })

        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })


}

// update user post
let updatePost = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                postId: data.postId
            }

            userDAO.getSinglePost(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null);
                }
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                postId: data.postId
            }
            var dataToSet = {
                "link": data.link?data.link:' ',
                "title": data.title,
                "expression_code": data.expression_code,
                "expression": data.expression,
                "platform": data.platform,
                "activity": data.activity ? data.activity : '',
                "genre": data.genre,
                "hashtags": data.hashtags,

            }
            userDAO.updatePost(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                }
                var criteria2 = {
                    postId: data.postId
                }
                userDAO.getGener(criteria2, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        var dataToSet1 = {
                            "genre": data.genre,
                        }
                        userDAO.updateGener(criteria2, dataToSet1, (err, dbData) => {
                        })
                    }
                });
                var criteria2 = {
                    postId: data.postId
                }
                userDAO.getHashTag(criteria2, (err, dbData) => {

                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        var dataToSet = {
                            "hashtags": data.hashtags,
                        }
                        userDAO.updateHashTag(criteria2, dataToSet, (err, dbData) => {
                        })
                    }
                });

                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Post update Successfully", "result": dataToSet });

            })


        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })
}

// get user post
let getPost = (data, callback) => {
    async.auto({
        checkPostinDB: (cb) => {
            if (data.userId && !data.genre && !data.platform) {
                var criteria = {
                    userId: data.userId,
                }
                userDAO.getPostData(criteria, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                        return;
                    }
                });
            }
            if (data.userId && data.genre) {
                var criteria2 = {
                    userId: data.userId,
                    genre: data.genre
                    // plateform: data.plateform ? data.plateform : ""
                }
                userDAO.getPostData2(criteria2, (err, dbData) => {
                    // console.log(err, "postiii")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });


                    }
                });
            }
            if (data.userId && data.platform) {
                var criteria2 = {
                    userId: data.userId,
                    //genre: data.genre
                    platform: data.platform
                }
                userDAO.getPostData3(criteria2, (err, dbData) => {
                    // console.log(err, "postiii")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });


                    }
                });
            }
            // else{
            //     cb(null)
            // }

        },
    }, (err, response) => {
        callback(response.checkPostinDB);
    })
}

//like unlike post
let likeAndUnLike = (data, callback) => {
    // console.log(data, "Ambuj")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.postId, !data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                postId: data.postId,
                userId: data.userId
            }
            userDAO.getLike(criteria, (err, dbData) => {
                // console.log(dbData, "ttt")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                }
                if (dbData && dbData.length) {
                    //    console.log(dbData, "uuu")
                    var criteria = {
                        postId: data.postId,
                        userId: data.userId
                    }
                    // var dataToSet = {
                    //     "likeStatus": data.likeStatus
                    // }
                    userDAO.unlike(criteria, (err, dbData) => {
                        //    console.log(err, "iiii")
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "You unlike this post" })
                    })
                }
                else {
                    cb(null)

                }
            });
        },
        createUserinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            let dataToSet = {
                "userId": data.userId,
                "postId": data.postId,
                "likeStatus": data.likeStatus,
            }
            userDAO.addlike(dataToSet, (err, dbData) => {
                //console.log(err, "Ambuj")
                criteria = {
                    "postId": data.postId,
                    "userId": data.userId

                }
                userDAO.getUserDeviceToken(criteria, (err, dbData) => {
                      if(dbData[0].userId == data.userId){
                        return;
                    }else{
                    userDAO.getUserDataForNotification(criteria, (err, notificationData) => {
                      userDAO.sentPostLikeData(criteria, (err, likePostData) => {
                        if (dbData[0].device_token != null) {
                            let user = {
                                userId: notificationData[0].userId.toString(),
                                userName: notificationData[0].userName,
                                profile_picture: notificationData[0].profilePicture,
                                //postId: data.postId,
                            };
                            var options = {
                                token: {
                                    key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                    keyId: "G6365Q88C7",
                                    teamId: "48CG7UJ7VV"
                                },
                                production: false
                            };
                            var dataToSet = {
                                userId : dbData[0].userId.toString(),
                                title : notificationData[0].userName.replace(/^./, notificationData[0].userName[0].toUpperCase()) + " liked your post",
                                type: "like"
                            }
                            userDAO.userNotification(dataToSet, (err, dbData) => {
                                //console.log(err,"postttttt")
                            })

                            var apnProvider = new apn.Provider(options);
                            let deviceToken = dbData[0].device_token;
    
                            var note = new apn.Notification();
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 3;
                            note.sound = "ping.aiff";
                            note.alert = notificationData[0].userName.replace(/^./, notificationData[0].userName[0].toUpperCase()) + " liked your post";
                            note.payload = { result: user, type: "post" ,postData:likePostData[0] };
                            note.topic = "com.qouch.app";
    
                            apnProvider.send(note, deviceToken).then((result) => {
                                console.log(result, "notification send");
                                console.log(note, "test notification")
                            });
    
                        }
                    }) 
                  })
                    }

                });

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "You like this post", "result": dataToSet });

            });
        }]
    }, (err, response) => {
        callback(response.createUserinDB);
    });
}

// user comment
let comment = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            var dataToSet = {
                "userId": data.userId,
                "postId": data.postId,
                "comment": data.comment,
            }
            userDAO.addComment(dataToSet, (err, dbData) => {
                // console.log(err, "aaaa")
                criteria = {
                    "postId": data.postId,
                }
                userDAO.getUserDeviceToken(criteria, (err, dbData) => {
                    console.log(dbData, "log")
                    criteria2 = {
                        "userId": data.userId,
                        "postId": data.postId,
                    }
                     if(dbData[0].userId == data.userId){
                        return;
                    }

                    else{
                    userDAO.getUserDataForNotification(criteria2, (err, notificationData) => {
                        //console.log(err,notificationData,"post............................")

                    userDAO.sentPostData(criteria2, (err, postData) => {
                        //console.log(err,postData,"post............................")
                        if (dbData[0].device_token != null) {
                            let user = {
                                userId: notificationData[0].userId.toString(),
                                userName: notificationData[0].userName,
                                profile_picture: notificationData[0].profilePicture,
    
                            };
                            var options = {
                                token: {
                                    key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                    keyId: "G6365Q88C7",
                                    teamId: "48CG7UJ7VV"
                                },
                                production: false
                            };
                            var dataToSet = {
                                userId : dbData[0].userId.toString(),
                                title : notificationData[0].userName.replace(/^./, notificationData[0].userName[0].toUpperCase()) + " has commented on your post",
                                type: "comment"
                            }
                            userDAO.userNotification(dataToSet, (err, dbData) => {
                                //console.log(err,"postttttt")
                            })
                            var apnProvider = new apn.Provider(options);
                            let deviceToken = dbData[0].device_token;
    
                            var note = new apn.Notification();
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 3;
                            note.sound = "ping.aiff";
                            note.alert = notificationData[0].userName.replace(/^./, notificationData[0].userName[0].toUpperCase()) + " has commented on your post";
                            note.payload = { result: user, post: postData[0], type: "comment"  };
                            note.topic = "com.qouch.app";
    
                            apnProvider.send(note, deviceToken).then((result) => {
                                console.log(result, "notification send");
                                console.log(note, "test notification")
                            });
    
                        }
                    })
})
                   } 
                });
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Comment added successfully" });
            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// get user comment
let getComment = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            var criteria = {
                "postId": data.postId,
            }
            userDAO.getComment(criteria, (err, dbData) => {
                // console.log(dbData, "jfdfdfdf")
                // console.log(err, "aaaa")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {
                    for (i = 0; i < dbData.length; i++) {

                        dbData[i].commentId = dbData[i].commentId.toString();
                        dbData[i].postId = dbData[i].postId.toString();
                        dbData[i].userId = dbData[i].userId.toString();
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData });
                } else {
                    cb(null, {
                        "statusCode": util.statusCode.OK, "statusMessage": "User comment not found", "result": []

                    })
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

// delete post
let deletePost = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                return;
            }
            var criteria = {
                postId: data.postId
            }

            userDAO.getActivePost(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } if (dbData && dbData.length > 0) {
                    //  console.log(dbData, "jdsds")
                    var criteria2 = {
                        "postId": dbData[0].postId,
                    }
                    dataToSet = {
                        "postStatus": "inactive"
                    }
                    userDAO.updatePostStatus(criteria2, dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                    })
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Post deleted successfully" });
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": "Post already deleted!" });
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

// update gener
let updateGener = (data, callback) => {
    // console.log(data, "hhhh")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                postId: data.postId
            }
            userDAO.getGener(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null);
                }
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                postId: data.postId
            }
            var dataToSet = {
                "genre": data.genre,
            }
            userDAO.updateGener(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User gener update successfully!" });
                }
            })

        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })
}

// user post report
let postReport = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            var dataToSet = {
                "userId": data.userId,
                "postId": data.postId,
                "comment": data.comment,
                "reportMessage": data.reportMessage,
            }
            userDAO.addReport(dataToSet, (err, dbData) => {
                // console.log(err, "aaaa")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "You have reported this post", "result": dataToSet });
            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/**get follower */
let getFollowers = (criteria, cb) => {
    userDAO.getAddFollower(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

/** Add Follower */
let follower = (data, callback) => {
    // console.log(data, "Ambuj")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.followerId, !data.followedId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                followerId: data.followerId,
                followedId: data.followedId

            }
            userDAO.getUnfollowStatus(criteria, (err, dbData) => {
                // console.log(dbData, "ttt")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                } if (dbData && dbData.length) {
                    // console.log(dbData, "uuu")
                    var criteria = {
                        followerId: data.followerId,
                        followedId: data.followedId
                    }
                    // var dataToSet = {
                    //     "followStatus": data.followStatus
                    // }
                    userDAO.deletefollowed(criteria, (err, dbData) => {
                        //   console.log(criteria, "iiii")
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                    })
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "You unfollow" })
                }
                else {
                    cb(null)

                }
            });
        },
        createUserinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            let dataToSet = {
                "followerId": data.followerId,
                "followedId": data.followedId,
                "followStatus": "true",
            }
            userDAO.addFollower(dataToSet, (err, dbData) => {
                //  console.log(err, "Ambuj")
                criteria = {
                    "followedId": data.followedId,
                }
                userDAO.followerData(criteria, (err, followerData) => {



                    userDAO.followerNotifitionData(criteria, (err, dbData) => {
                        console.log(dbData, "log")

                        if (dbData[0].device_token != null) {
                            let user = {
                                userId: dbData[0].userId.toString(),
                                userName: dbData[0].userName,
                                profile_picture: dbData[0].profilePicture,

                            };
                            var options = {
                                token: {
                                    key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                    keyId: "G6365Q88C7",
                                    teamId: "48CG7UJ7VV"
                                },
                                production: false
                            };
                            var dataToSet = {
                                userId : dbData[0].userId.toString(),
                                title : followerData[0].userName.replace(/^./, followerData[0].userName[0].toUpperCase()) + " is now following you",
                                type: "follow"
                            }
                            userDAO.userNotification(dataToSet, (err, dbData) => {
                                console.log(err,"postttttt")
                            })
                            var apnProvider = new apn.Provider(options);
                            let deviceToken = dbData[0].device_token;

                            var note = new apn.Notification();
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 3;
                            note.sound = "ping.aiff";
                            note.alert = followerData[0].userName.replace(/^./, followerData[0].userName[0].toUpperCase()) + " is now following you";
                            note.payload = { result: user, type: "follow" };
                            note.topic = "com.qouch.app";

                            apnProvider.send(note, deviceToken).then((result) => {
                                console.log(result, "notification send");
                                console.log(note, "test notification")
                            });

                        }
                    });
                });
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Success", "result": dataToSet });

            });
        }]
    }, (err, response) => {
        callback(response.createUserinDB);
    });
}

/**unfollow  */
let unfollow = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            let criteria = {
                "followerId": data.followerId,
                "followedId": data.followedId
            }
            userDAO.getUnfollow(criteria, (err, dbData) => {
                // console.log(err, "pppppoooo")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length != 0 && dbData[0].followStatus == 'false') {
                    //console.log(dbData)
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": "You already unfollow this user."
                    })
                    return;
                }
                else if (dbData && dbData.length == 0) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": "Relation id not found"
                    })
                    return;
                }
                else {

                    let criteria = {
                        "followerId": data.followerId,
                        "followedId": data.followedId
                    }
                    var dataToSet = {
                        "followStatus": "false",
                    }
                    userDAO.updateFollowStatus(criteria, dataToSet, (err, dbData) => {
                        //   console.log(criteria, "ppp")

                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                        //cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User unfollow successfully." });
                    })
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User unfollow successfully." });


                }

            });
        },
    }, (err, response) => {
        //console.log(response)
        callback(response.checkUserExistsinDB);
    })


}

/**follow status */
let followStatus = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            let criteria = {
                "followerId": data.followerId,
                "followedId": data.followedId
            }
            userDAO.getUnfollowStatus(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User follow status", "result": dbData[0] });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/** search by hash tag post */
let searchByHashTag = (data, callback) => {
    // console.log(data,"ambuj")
    async.auto({
        checkHashTagExistsinDB: (cb) => {

            let criteria = {
                "search": data.search,
                "userId": data.userId
            }

            //console.log(data.search.charAt(0))
            if (data.search.charAt(0) == '#') {
                var search_string = data.search.split("#")
                let criteria1 = {
                    "search": search_string[1],
                    "userId": data.userId
                }
                //console.log("!!!",criteria1)
                userDAO.getSearchHashTag(criteria1, (err, dbData) => {
                    //  console.log(err, "dsd")
                    if (err) {
                        return;
                    }
                    // if(dbData && dbData.length == 0){
                    // }
                    else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                    }
                });
            }
            else {
                userDAO.getSearch(criteria, (err, dbData) => {
                    //  console.log(err, "dsd")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    }
                    else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                    }
                });

            }


        },
    }, (err, response) => {
        callback(response.checkHashTagExistsinDB);
    })
}

// search hash tags
let searchHashTag = (data, callback) => {
    async.auto({
        searchHashTagExistsinDB: (cb) => {

            // let criteria1 = {
            //     "search": data.search,
            // }
            //console.log(data.search.charAt(0))
            if (data.search.charAt(0) == '#') {
                var search_string = data.search.split("#")
                let criteria1 = {
                    "search": search_string[1],
                    "userId": data.userId
                }
                //console.log("!!!",criteria1)
                userDAO.getSearchHashTag(criteria1, (err, dbData) => {
                    //  console.log(dbData, "dsd")
                    if (err) {
                        return;
                    }
                    else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                    }
                });
            }
        }
    }, (err, response) => {
        callback(response.searchHashTagExistsinDB);
    })
}

let getFollowerList = (data, callback) => {
    //console.log(data, "load")
    async.auto({
        checkFollowerDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                return;
            }
            var criteria = {
                userId: data.userId
            }
            userDAO.getFollowerList(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    if (dbData.length == 0) {
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "No follower of this user", result: [] });
                        return;
                    }

                    //     console.log(dbData,'09876543');
                    var result = [];
                    var i = 0;
                    var loopArray = function (arr) {
                        customAlert(arr[i], function () {
                            i++;
                            if (i < arr.length) {
                                loopArray(arr);
                            }
                        });
                    }

                    function customAlert(msg, callback) {
                        if (msg) {
                            let criteria = {
                                followerId: data.userId,
                                followedId: msg.followerId
                            }

                            // code to check whether also following back...
                            userDAO.checkFollowBack(criteria, (err, isFollowing) => {
                                //console.log(isFollowing, 'est');
                                if (err) {
                                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_THREE, "statusMessage": util.statusMessage.SERVER_BUSY })
                                    return;
                                }
                                else {
                                    if (isFollowing && isFollowing.length > 0) {
                                        let obj = {};
                                        obj.followerId = msg.followerId;
                                        obj.userName = msg.userName;
                                        obj.profilePicture = msg.profilePicture;
                                        obj.followStatus = parseInt(isFollowing[0].isFollow) == 0 ? false : true;
                                        result.push(obj);
                                        if (i + 1 == dbData.length) {
                                            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.DATA_FETCHED, "result": result });
                                            return;
                                        }
                                        callback();



                                    }

                                }

                            });
                        }
                    }
                    loopArray(dbData);
                    // cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "No follower of this user" });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkFollowerDB);
    })
}

let getFollowedList = (data, callback) => {
    async.auto({
        checkFollowerDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                return;
            }
            var criteria = {
                userId: data.userId
            }
            userDAO.getFollowedList(criteria, (err, dbData) => {
                //console.log(dbData, "oooo")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } if (dbData && dbData.length > 0) {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].followedId = dbData[i].followedId.toString();

                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.GET_DATA, "result": dbData });
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "user have no follower", "result": [] });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkFollowerDB);
    })
}

let getAllFeed = (data, callback) => {
    async.auto({
        checkPostinDB: (cb) => {

            var criteria = {
                userId: data.userId
            }
            userDAO.getPostListing(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].userId = dbData[i].userId.toString();
                        dbData[i].expression_code = dbData[i].expression_code.toString();
                        //dbData[i].likes = dbData[i].likes;
                        dbData[i].isLike = "true";
                        //dbData[i].comments = 0;
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkPostinDB);
    })
}

//not use now
let movieList = (data, callback) => {
    async.series({
        checkPostinDB: (cb) => {
            client.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=3833e5d9a19204cafaaa82d889bd7fdb`,
                function (dataList, response) {
                    var queryObj = dataList.results

                    queryObj.map(query => {
                        let dataToSet = {
                            "adult": query.adult ? "true" : "false",
                            "backdrop_path": query.backdrop_path ? query.backdrop_path : "",
                            "genre_ids": query.genre_ids ? query.genre_ids.toString() : "",
                            "id": query.id,
                            "original_language": query.original_language ? query.original_language : "",
                            "original_title": query.original_title ? query.original_title : "",
                            "overview": query.overview ? query.overview : "",
                            "poster_path": query.poster_path ? query.poster_path : "",
                            "release_date": query.release_date ? query.release_date : "",
                            "title": query.title ? query.title : '',
                            "video": query.video ? "true" : "false",
                            "vote_average": query.vote_average ? query.vote_average : '',
                            "vote_count": query.vote_count ? query.vote_count : '',
                            "popularity": query.popularity ? query.popularity : '',

                        }
                        console.log("OUTER", query.id)
                        userDAO.movie(dataToSet, (err, dbData) => {
                            if (!err)
                                console.log("INNER", query.id)
                        });
                    })
                    cb(null, dataList);
                    return;
                    //var query = dataList.results[0]

                    //cb(null,dataList);
                });
        },
    }, (err, response) => {
        callback(response.checkPostinDB);
    })
}

// let getMovieList = (data, callback) => {
//     console.log(data,"log")
//     async.auto({
//         checkPostinDB: (cb) => {


//             userDAO.getMovieList((err, dbData) => {
//                 console.log(dbData,"log")

//                 if (err) {
//                     cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
//                     return;
//                 } else {

//                     cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Movies list", "result": dbData });
//                 }
//             });
//         },
//     }, (err, response) => {
//         callback(response.checkPostinDB);
//     })
// }

// movie recommendations by user choice 
let getMovieList = (data, callback) => {
    async.auto({
        checkFlickExistsinDB: (cb) => {

            var criteria = { 
                "userId" : data.userId
            }
            userDAO.getUserMovieGenre(criteria, (err, dbData)=>{
                //console.log(dbData,"ooooo")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.DB_ERROR });
                
                }if(dbData && dbData.length){

                    var criteria = { 
                        "genre_ids" : dbData[0].genre
                    }
                    userDAO.sentUserchoice(criteria, (err, dbData)=>{
                       // console.log(criteria, movieData,"Ambuj")
                        cb(null, { "statusCode": util.statusCode.OK,  "statusMessage": "Movies list", "result": dbData });

                    })

                }else{

                    userDAO.getMovieList((err, dbData) => {
                        //console.log(dbData,"log")

                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Movies list", "result": dbData });

                    });
                }
            })
        },

    }, (err, response) => {
        callback(response.checkFlickExistsinDB);
    })
}

let getFollow = (criteria, cb) => {
    userDAO.getFollowStatus(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

let getBlockUserStatus = (criteria, cb) => {
    userDAO.getBlockUser(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

let getOtherUserPost = (criteria, cb) => {
    userDAO.getOtherPost(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

//other user profile
let getOtherProfile = (data, callback) => {
    async.parallel({
        otherProfile: (cb) => {
            var criteria = {
                userId: data.otherUserId
            }
            getuser(criteria, (err, response) => {
                //console.log(response, "asasas")
                cb(null, response);
            });
        },
        postData: (cb) => {
            var criteria = {
                userId: data.otherUserId,
                otherUserId: data.userId
            }
            getOtherUserPost(criteria, (err, response) => {

                cb(null, response);
            });
        },
        follower: (cb) => {
            var criteria = {
                followerId: data.otherUserId
            }
            getFollower(criteria, (err, response) => {

                cb(null, response);
            });
        },
        followed: (cb) => {
            var criteria = {
                followedId: data.otherUserId
            }
            getFollowed(criteria, (err, response) => {

                cb(null, response);
            });
        },
        follow: (cb) => {
            var criteria = {
                followedId: data.otherUserId,
                followerId: data.userId
            }
            getFollow(criteria, (err, response) => {
                if (response && response.length) {
                    cb(null, "true");
                } else {
                    cb(null, "false");
                }
            });
        },
        blockStatus: (cb) => {
            var criteria = {
                fromUserId: data.userId,
                toUserId: data.otherUserId
            }
            getBlockUserStatus(criteria, (err, response) => {
                if (response && response.length) {
                    cb(null, "blocked");
                } else {
                    cb(null, "active");
                }
            });
        }
    }, (err, response) => {
        //console.log(response, "iiiii")
        // for(i = 0; i<response.length;i++){
        let res1 = {};
        res1.otherProfile = response.otherProfile[0];
        res1.otherPost = response.postData;
        res1.otherProfile.follower = response.follower[0].follower,
            res1.otherProfile.followed = response.followed[0].followed,
            res1.otherProfile.follow = response.follow,
            res1.otherProfile.blockStatus = response.blockStatus

        //res1 = res2;
        callback({ "statusCode": util.statusCode.OK, "statusMessage": "User data fetch successfully", "result": res1 });
        //   }


    }),
        (err) => {
            callback(err);
        }
}

//not in use 
let getPostfilter = (data, callback) => {
    async.auto({
        checkHashTagExistsinDB: (cb) => {
            if (data.genre) {
                let criteria1 = {
                    "genre": data.genre,
                }
                userDAO.getFilterPost(criteria1, (err, dbData) => {
                    //console.log(dbData,"ambuj")
                    if (err) {
                        return;
                    }
                    else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt
                        }
                        cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                    }
                });
            } else {
                let criteria1 = {
                    "platform": data.platform,
                }
                userDAO.getFilterPlatform(criteria1, (err, dbData) => {
                    //console.log(dbData,"ambuj")
                    if (err) {
                        return;
                    }
                    else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt
                        }
                        cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                    }
                });
            }

        },
    }, (err, response) => {
        callback(response.checkHashTagExistsinDB);
    })
}

// save fick status
let saveFlick = (data, callback) => {
    async.auto({
        checkFlickExistsinDB: (cb) => {

            var dataToSet = {
                "userId": data.userId,
                "id": data.id,
                "status": data.status,
            }
            if(data.status == 'watched_like'){
                criteria1 = {
                "userId": data.userId,
            }
            userDAO.getUserCount(criteria1, (err, limitedData) => {
                console.log(limitedData,"post")
                if(limitedData[0].CARDLIMIT == 50){
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": "Your watchlist is full. Come back later" });
                    return;
                }else{
                     userDAO.saveFlick(dataToSet, (err, dbData) => {
                   // console.log(dbData,"post")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
    
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Data save successfully" });
                })
                criteria = {
                    "id": data.id
                }
                userDAO.getFlickData(criteria, (err, flickData) => {
                    dataToSet = {}
                    dataToSet.userId = data.userId
                    dataToSet.title = flickData[0].original_title,
                    dataToSet.language = flickData[0].original_language,
                    dataToSet.releaseDate = flickData[0].release_date,
                    dataToSet.poster = flickData[0].poster_path,
                    dataToSet.rating = flickData[0].vote_average,
                    dataToSet.description = flickData[0].overview,
                    dataToSet.genre = flickData[0].genre_ids
    
                   
    
                    userDAO.saveWishList(dataToSet, (err, wishData) => {
                            if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        }
                            var genre = []
                            flickData[0].genre_ids.split(",").map(ele =>{
                                   let arr = [];
                                   arr.push(data.userId);
                                   arr.push(ele)
                                      
                                genre.push(arr)
                            })
                            userDAO.saveMovieUserGenre(genre, (err, movieGenre)=>{  
                        })                    
                    })
                })
                }

            })
               
            }else if(data.status == 'not_watched_interested'){
                criteria2 = {
                    "userId": data.userId,
                }
                userDAO.getUserCount(criteria2, (err, limitedData) => {
                    if(limitedData[0].CARDLIMIT == 50){
                        cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": "Your watchlist is full. Come back later" });
                        return;
                    }else{
                        userDAO.saveFlick(dataToSet, (err, dbData) => {
                            //console.log(dbData,"post")
                            if (err) {
                                cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
            
                            }
                            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Data save successfully" });
                        })
                        criteria = {
                            "id": data.id
                        }
                        userDAO.getFlickData(criteria, (err, flickData) => {
                            dataToSet = {}
                            dataToSet.userId = data.userId
                            dataToSet.title = flickData[0].original_title,
                            dataToSet.language = flickData[0].original_language,
                            dataToSet.releaseDate = flickData[0].release_date,
                            dataToSet.poster = flickData[0].poster_path,
                            dataToSet.rating = flickData[0].vote_average,
                            dataToSet.description = flickData[0].overview,
                            dataToSet.genre = flickData[0].genre_ids
            
                           
            
                            userDAO.saveWishList(dataToSet, (err, wishData) => {
                                    if (err) {
                                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                                }
                                    var genre = []
                                    flickData[0].genre_ids.split(",").map(ele =>{
                                           let arr = [];
                                           arr.push(data.userId);
                                           arr.push(ele)
                                              
                                        genre.push(arr)
                                    })
                                    userDAO.saveMovieUserGenre(genre, (err, movieGenre)=>{  
                                })                    
                            })
                        })  
                    }
    
                })

            }else{
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Data save successfully" });
            }   
        },

    }, (err, response) => {
        callback(response.checkFlickExistsinDB);
    })
}

// get user flick 
let getUserWish = (data, callback) => {
    async.auto({
        checkHashTagExistsinDB: (cb) => {

            let criteria1 = {
                "userId": data.userId,
            }
            userDAO.getUserWish(criteria1, (err, dbData) => {

                if (err) {
                    return;
                }
                else {

                    dbData = dbData.filter(ele => {
                        ele.wishId = ele.wishId.toString();
                        ele.userId = ele.userId.toString();
                        ele.rating = ele.rating.toString();
                        if (ele.watchStatus == 'watched') {
                            return false;
                        }
                        else {
                            return true;
                        }
                    })
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkHashTagExistsinDB);
    })
}

//get user wish details
let getUserWishDetails = (data, callback) => {
    async.auto({
        checkHashTagExistsinDB: (cb) => {

            let criteria1 = {
                "wishId": data.wishId,
            }
            userDAO.getUserWishDetails(criteria1, (err, dbData) => {

                if (err) {
                    return;
                }
                else {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].wishId = dbData[i].wishId.toString();
                        dbData[i].userId = dbData[i].userId.toString();
                        dbData[i].rating = dbData[i].rating.toString();
                    }

                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData[0] });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkHashTagExistsinDB);
    })
}

// update wish list item
let updateWishListItem = (data, callback) => {
    async.auto({
        deleteUserExistsinDB: (cb) => {
            if (data.watchStatus == "watched") {
                let criteria = {
                    "wishId": data.wishId,
                }
                let dataToSet = {
                    "watchStatus": data.watchStatus
                }
                userDAO.updateWatchStatus(criteria, dataToSet, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    }
                });
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User watched" });

            }
            if (data.watchStatus == "remove") {
                let criteria = {
                    "wishId": data.wishId,
                }
                userDAO.deleteWish(criteria, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User wish deleted" });
                    }
                });
            }

        },
    }, (err, response) => {
        callback(response.deleteUserExistsinDB);
    })
}

//Get All Trending post
let getTendingPost = (data, callback) => {
    async.auto({
        checkPostinDB: (cb) => {
            if (data.userId && !data.genre && !data.platform) {
                criteria = {
                    "userId": data.userId,
                }
                // console.log(criteria,"pp")
                userDAO.getTrendingPost(criteria, (err, dbData) => {
                    console.log(err, "ambuj")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                        return;
                    }
                });
            }
            if (data.userId && data.genre) {
                criteria = {
                    "userId": data.userId,
                    "genre": data.genre
                }
                // console.log(criteria,"pp")
                userDAO.getTrendingPost1(criteria, (err, dbData) => {
                    //  console.log(err, "ambuj")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                        return;
                    }
                });
            }
            if (data.userId && data.platform) {
                criteria = {
                    "userId": data.userId,
                    "platform": data.platform
                }
                // console.log(criteria,"pp")
                userDAO.getTrendingPost2(criteria, (err, dbData) => {
                    console.log(err, "ambuj")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        for (i = 0; i < dbData.length; i++) {
                            dbData[i].postId = dbData[i].postId.toString();
                            dbData[i].userId = dbData[i].userId.toString();
                            dbData[i].expression_code = dbData[i].expression_code.toString();
                            dbData[i].createdAt = dbData[i].createdAt

                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                        return;
                    }
                });
            }
        },
    }, (err, response) => {
        callback(response.checkPostinDB);
    })
}

//What's new in post
let getWhatsNewInPost = (data, callback) => {
    async.auto({
        checkPostinDB: (cb) => {

            userDAO.getWhatsNew((err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].id = dbData[i].id
                        dbData[i].language = dbData[i].original_language; delete dbData[i].original_language
                        dbData[i].title = dbData[i].original_title; delete dbData[i].original_title
                        dbData[i].poster = dbData[i].poster_path; delete dbData[i].poster_path
                        dbData[i].rating = dbData[i].vote_average; delete dbData[i].vote_average
                        dbData[i].releaseDate = dbData[i].release_date; dbData[i].release_date
                        dbData[i].description = dbData[i].overview; delete dbData[i].overview
                        dbData[i].genre = dbData[i].genre_ids.split(","); delete dbData[i].genre_ids


                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                    return;
                }
            });
        },
    }, (err, response) => {
        callback(response.checkPostinDB);
    })
}

//Get user genre
let getUserGenerList = (data, callback) => {
    async.auto({
        checkUserGenreExistsinDB: (cb) => {

            let criteria1 = {
                "userId": data.userId,
            }
            userDAO.getUserGener(criteria1, (err, dbData) => {
                //  console.log(dbData,"ambuj")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].userId = dbData[i].userId.toString();
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserGenreExistsinDB);
    })
}

//Update user genre 
let updateUserGener = (data, callback) => {
    // console.log(data, "hhhh")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }
            userDAO.getUserGener(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null);
                }
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                userId: data.userId
            }
            var dataToSet = {
                "genre": data.genre,
            }
            userDAO.updateUserGener(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "User gener update successfully!" });
                }
            })

        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })
}

//Use block And unblock
let userBlock = (data, callback) => {
    //  console.log(data, "Ambuj")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.fromUserId, !data.toUserId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                fromUserId: data.fromUserId,
                toUserId: data.toUserId

            }
            userDAO.getBlockUser(criteria, (err, dbData) => {
                //  console.log(dbData, "ttt")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                } if (dbData && dbData.length) {
                    //   console.log(dbData, "uuu")
                    var criteria = {
                        fromUserId: data.fromUserId,
                        toUserId: data.toUserId
                    }

                    userDAO.unblockUser(criteria, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                    })

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "You unblock" })
                }
                else {
                    cb(null)

                }
            });
        },
        createUserinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            let dataToSet = {
                "fromUserId": data.fromUserId,
                "toUserId": data.toUserId,
                "blockStatus": "blocked",
            }
            userDAO.addBlockUser(dataToSet, (err, dbData) => {
                // console.log(err, "Ambuj")
                var criteria1 = {
                    followerId: data.fromUserId,
                    followedId: data.toUserId
                }
                userDAO.deletefollowed(criteria1, (err, dbData) => {
                    //   console.log(err,"ambuj")
                    //   console.log(dbData,"check")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    }
                })
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Success", "result": dataToSet });

            });
        }]
    }, (err, response) => {
        callback(response.createUserinDB);
    });
}

//user Block list
let getUserBlockList = (data, callback) => {
    async.auto({
        checkBlockListExistsinDB: (cb) => {

            let criteria = {
                "fromUserId": data.userId,
            }
            userDAO.getBlockUserList(criteria, (err, dbData) => {
                if (err) {
                    return;
                }
                else {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].userId = dbData[i].toUserId.toString(); delete dbData[i].toUserId
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkBlockListExistsinDB);
    })
}

//user Active and deactive
let accountStatus = (data, callback) => {
    //console.log(data, "hhhh")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }
            userDAO.getUserAccountStatus(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null);
                }
            });
        },
        updateAccountStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                userId: data.userId
            }
            var dataToSet = {
                "accountStatus": data.accountStatus,
            }
            userDAO.updateAccountStatus(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Your account deactive successfully!" });
                }
            })

        }]
    }, (err, response) => {
        callback(response.updateAccountStatusinDB);
    })
}

//User movie Data List 
let movieDataList = async (data, callback) => {
    //async.series({
    //    checkPostinDB: async(cb) => {
    datares = [];

    for (let i = 1; i <= 60; i++) {
        await new Promise((reso, reje) => {
            client.get(`https://api.themoviedb.org/3/movie/popular?api_key=3833e5d9a19204cafaaa82d889bd7fdb&language=en-US&page=` + i,
                function (dataList, response) {
                    // console.log("i-------",dataList)
                    datares.push(dataList)
                    reso();
                    var queryObj = dataList.results

                    console.log(i + "  START")
                    queryObj.map(query => {
                        let dataToSet = {
                            "adult": query.adult ? "true" : "false",
                            "backdrop_path": query.backdrop_path ? query.backdrop_path : "",
                            "genre_ids": query.genre_ids ? query.genre_ids.toString() : "",
                            "id": query.id,
                            "original_language": query.original_language ? query.original_language : "",
                            "original_title": query.original_title ? query.original_title : "",
                            "overview": query.overview ? query.overview : "",
                            "poster_path": query.poster_path ? query.poster_path : "",
                            "release_date": query.release_date ? query.release_date : "",
                            "title": query.title ? query.title : '',
                            "video": query.video ? "true" : "false",
                            "vote_average": query.vote_average ? query.vote_average : '',
                            "vote_count": query.vote_count ? query.vote_count : '',
                            "popularity": query.popularity ? query.popularity : '',

                        }
                        // console.log("MIDDLE", query.id)
                        userDAO.movie(dataToSet, (err, dbData) => {
                            console.log(err)
                            if (err)
                                console.log("ERROR ID ", query.id)
                            else {
                                console.log("Success ID ", query.id)
                            }
                        });
                    })
                    //console.log(i+"  END")
                    reso();


                    // var query = dataList.results[0]

                    // cb(null,dataList);
                });
        })

    }
    callback(datares);
    return;

    //    },
    // }, (err, response) => {
    //     callback(response.checkPostinDB);
    // })
}

//Search movies by user
let searchMovies = (data, callback) => {
    async.series({
        checkPostinDB: (cb) => {
            var query = data.query;
            var page = data.page;
            client.get(`https://api.themoviedb.org/3/search/movie?api_key=3833e5d9a19204cafaaa82d889bd7fdb&language=en-US&query=` + query + `&page=` + page + `&include_adult=false`,
                function (dataList, response) {
                    var queryObj = dataList.results

                    queryObj.map(query => {

                        query.popularity; delete query.popularity;
                        query.backdrop_path; delete query.backdrop_path;
                        query.vote_count; delete query.vote_count;


                        query.title = query.original_title ? query.original_title : ''; delete query.original_title;
                        query.language = query.original_language; delete query.original_language;
                        query.releaseDate = query.release_date; delete query.release_date;
                        query.poster = query.poster_path; delete query.poster_path;
                        query.rating = query.vote_average.toString(); delete query.vote_average;
                        query.description = query.overview; delete query.overview;
                        query.genre = query.genre_ids; delete query.genre_ids;


                        //console.log("OUTER", dataToSet)
                        // userDAO.movie(dataToSet, (err, dbData) => {
                        //     if (!err)
                        //         console.log("INNER", query.id)
                        // });
                        //cb(null, dataToSet)

                    })
                    cb(null, { "statusCode": util.statusCode.OK, "result": queryObj });
                    return;

                });
        },
    }, (err, response) => {
        callback(response.checkPostinDB);
    })
}

//Off App notification 
let offNotification = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length == 0) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.USER_NOT_FOUND });
                    return;
                }

                cb(null);
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var criteria = {
                userId: data.userId
            }
            var dataToSet = {
                "device_token": " "

            }
            userDAO.removeDeviceToken(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Notification off successfully", "result": dataToSet });


            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })

}



// movie recommendations by user choice 
// let movieRecommendatio = (data, callback) => {
//     async.auto({
//         checkFlickExistsinDB: (cb) => {

//             var criteria = { 
//                 "userId" : data.userId
//             }
//             userDAO.getUserMovieGenre(criteria, (err, dbData)=>{
//                 console.log(dbData,"ooooo")
//                 if (err) {
//                     cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.DB_ERROR });
//                 }else{

//                     var criteria = { 
//                         "genre_ids" : dbData[0].genre
//                     }
//                     userDAO.sentUserchoice(criteria, (err, movieData)=>{
//                         //console.log(criteria, movieData,"Ambuj")
//                         cb(null, { "statusCode": util.statusCode.OK, "statusMessage": movieData });

//                     })

//                 }
//             })
//         },

//     }, (err, response) => {
//         callback(response.checkFlickExistsinDB);
//     })
// }


let getNotificationList = (data, callback) => {
    async.auto({
        checkNotificationExistsinDB: (cb) => {

            let criteria = {
                "userId": data.userId,
            }
            userDAO.getNotificationList(criteria, (err, dbData) => {
                if (err) {
                    return;
                }
                else {
                    for (i = 0; i < dbData.length; i++) {
                        dbData[i].Id = dbData[i].Id.toString();
                        dbData[i].userId = dbData[i].userId.toString(); //delete dbData[i].toUserId
                    }
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkNotificationExistsinDB);
    })
}

module.exports = {
    signup: signup,
    login: login,
    forgotPassword: forgotPassword,
    verifyForgotLink: verifyForgotLink,
    updateStatus: updateStatus,
    completeProfile: completeProfile,
    getUserProfile: getUserProfile,
    logOut: logOut,
    updateForgotPassword: updateForgotPassword,
    LoginWithFacebook: LoginWithFacebook,
    changePassword: changePassword,
    LoginWithGoogle: LoginWithGoogle,
    updateProfile: updateProfile,
    comment: comment,
    updateDevicetoken: updateDevicetoken,
    addPost: addPost,
    getPost: getPost,
    likeAndUnLike: likeAndUnLike,
    getComment: getComment,
    updatePost: updatePost,
    deletePost: deletePost,
    updateGener: updateGener,
    postReport: postReport,
    follower: follower,
    unfollow: unfollow,
    followStatus: followStatus,
    searchByHashTag: searchByHashTag,
    getFollowerList: getFollowerList,
    getFollowedList: getFollowedList,
    getAllFeed: getAllFeed,
    movieList: movieList,
    getMovieList: getMovieList,
    getOtherProfile: getOtherProfile,
    getPostfilter: getPostfilter,
    saveFlick: saveFlick,
    getUserWish: getUserWish,
    searchHashTag: searchHashTag,
    updateWishListItem: updateWishListItem,
    getTendingPost: getTendingPost,
    getWhatsNewInPost: getWhatsNewInPost,
    getUserGenerList: getUserGenerList,
    updateUserGener: updateUserGener,
    userBlock: userBlock,
    getUserBlockList: getUserBlockList,
    accountStatus: accountStatus,
    getUserWishDetails: getUserWishDetails,
    movieDataList: movieDataList,
    searchMovies: searchMovies,
    offNotification: offNotification,
    getNotificationList : getNotificationList,
    //movieRecommendatio: movieRecommendatio,
};

