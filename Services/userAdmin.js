/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: 13/12/2018
*/

let async = require('async'),
    queryString = require('querystring');

let util = require('../Utilities/util'),
    userDAO = require('../DAO/userAdminDAO');

// Get All User By Admin
let getAllUser = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            userDAO.getAllUser((err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {
                    // for (i = 0; i < dbData.length; i++) {

                    //     dbData[i].commentId = dbData[i].commentId.toString();
                    //     dbData[i].postId = dbData[i].postId.toString();
                    //     dbData[i].userId = dbData[i].userId.toString();
                    // }
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

// Get user by Admin
let getUserDetails = (data, callback) => {//console.log(data.userId);return;
    async.auto({
        checkUserExistsinDB: (cb) => {
            var criteria = {
                "userId": data.userId
            }
            userDAO.getUsers(criteria, (err, dbData) => {
                console.log(err, criteria, "post")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {
                    //for (i = 0; i < dbData.length; i++) {

                    //     dbData[i].commentId = dbData[i].commentId.toString();
                    //    dbData[i].postId = dbData[i].postId.toString();
                    //   dbData[i].userId = dbData[i].userId.toString();
                    //}
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData[0] });
                } else {
                    cb(null, {
                        "statusCode": util.statusCode.OK, "statusMessage": "User comment not found", "result": criteria

                    })
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

//Get post by Admin
let getPostDetails = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            var criteria = {
                "postId": data.postId
            }
            userDAO.getPostDetail(criteria, (err, dbData) => {
                console.log(err, criteria, "post")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {
                    //for (i = 0; i < dbData.length; i++) {

                    //     dbData[i].commentId = dbData[i].commentId.toString();
                    //    dbData[i].postId = dbData[i].postId.toString();
                    //   dbData[i].userId = dbData[i].userId.toString();
                    //}
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData[0] });
                } else {
                    cb(null, {
                        "statusCode": util.statusCode.OK, "statusMessage": "post not found"

                    })
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// Edit user by Admin
let editUserByAdmin = (data, files, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            // if (data.userId) {
            //     cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
            //     return;
            // }
            var criteria = {
                userId: data.userId
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                //console.log(dbData, "Get user Data")
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
            userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                console.log(dataToSet, "post")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                // dataToSet2 = {
                //     "userId": data.userId,
                //     "genre": data.genre ? data.genre : ""
                // }
                // userDAO.updateUserGener(dataToSet2, (err, dbData) => {
                //     //console.log(dataToSet,"post")
                //     // cb(null)
                // });
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.STATUS_UPDATED, "result": dataToSet });


            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })


}

// Get All Post By Admin
let getAllPost = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            userDAO.getAllPost((err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData });
                } else {
                    cb(null, {
                        "statusCode": util.statusCode.OK, "statusMessage": "User post not found"

                    })
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

// Add Post By Admin
let addPostByAdmin = (data, callback) => {
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
                "link": data.link,
                "title": data.title,
                "expression_code": data.expression_code,
                "expression": data.expression,
                "platform": data.platform,
                "activity": data.activity ? data.activity : '',

            }
            userDAO.addPost(dataToSet, (err, dbData) => {
                console.log(dbData, "fdsrtyu")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                }
                var dataToSet = {
                    "postId": dbData.insertId,
                    "genre": data.genre,
                }
                userDAO.addGener(dataToSet, (err, dbData) => {
                    console.log(dbData, "fdsrtyu")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                    }
                })
                var dataToSet2 = {
                    "postId": dbData.insertId,
                    "hashtags": (data.hashtags) ? data.hashtags + "," : "",
                }
                userDAO.addHashTag(dataToSet2, (err, dbData) => {
                    console.log(dbData, "fdsrtyu")
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

// Edit Post By Admin
let editPostByAdmin = (data, callback) => {
    
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
                "link": data.link,
                "title": data.title,
                // "expression_code": data.expression_code,
                // "expression": data.expression,
                "platform": data.platform,
                //"activity": data.activity ? data.activity : '',

            }
            userDAO.updatePost(criteria, dataToSet, (err, dbData) => {
                //  console.log(dbData, "fdsrtyu")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                }
                var criteria2 = {
                    postId: data.postId
                }
                userDAO.getGener(criteria2, (err, dbData) => {
                    // console.log(dbData, "l668888ll")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    } else {
                        var dataToSet = {
                            "genre": data.genre,
                        }
                        userDAO.updateGener(criteria2, dataToSet, (err, dbData) => {
                        })
                    }
                });
                // var criteria2 = {
                //     postId: data.postId
                // }
                // userDAO.getHashTag(criteria2, (err, dbData) => {
                //     // console.log(dbData, "lll999")
                //     if (err) {
                //         cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                //         return;
                //     } else {
                //         var dataToSet = {
                //             "hashtags": data.hashtags,
                //         }
                //         userDAO.updateHashTag(criteria2, dataToSet, (err, dbData) => {
                //         })
                //     }
                // });
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Post update Successfully" });
            })

        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })
}

// Admin deactivate user account
let adminDeactivateUser = (data, callback) => {
    console.log(data,"post")
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.DB_ERROR });
                return;
            }
            var criteria = {
                "userId": data.userId
            }
            userDAO.getUserAccountStatus(criteria, (err, dbData) => {
                console.log(dbData,"post test")
                if (err) {
                    cb(null, { err })
                    return;
                }
                if(dbData[0].accountStatus == "deactive"){
                    var criteria = {
                        userId: data.userId
                    }
                    var dataToSet = {
                        "accountStatus": "Active",
                    }
                    userDAO.updateAccountStatus(criteria, dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        } else {
                            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Your account has been activate by admin" });
                        }

                        userDAO.getUser(criteria, (err, userData) => {
                            console.log(err,"post")
                            if (userData[0].device_token != null) {
                                let user = {
                                    userId: userData[0].userId.toString(),
                                    userName: userData[0].userName,
                                    profile_picture: userData[0].profilePicture,

                                };
                                var options = {
                                    token: {
                                        //key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                        key:"/home/techugo/Desktop/data/qouchPotato/AuthKey_G6365Q88C7.p8",
                                        keyId: "G6365Q88C7",
                                        teamId: "48CG7UJ7VV"
                                    },
                                    production: false
                                };

                                var apnProvider = new apn.Provider(options);
                                let deviceToken = userData[0].device_token;

                                var note = new apn.Notification();
                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                note.badge = 3;
                                note.sound = "ping.aiff";
                                note.alert = "Your account has been active by admin";
                                note.payload = { result: user, type: "like" };
                                note.topic = "com.qouch.app";

                                apnProvider.send(note, deviceToken).then((result) => {
                                    console.log(result, "notification send");
                                    console.log(note, "test notification")
                                });
                            }  
                        })
                    })
                    return;
                } 
                else {
                    cb(null)
                    return;
                }
            })
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
                "accountStatus": "deactive",
            }
            userDAO.updateAccountStatus(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Your account has been deactivated by admin" });
                }
                userDAO.getUser(criteria, (err, userData) => {
                    console.log(err,"post")
                    if (userData[0].device_token != null) {
                        let user = {
                            userId: userData[0].userId.toString(),
                            userName: userData[0].userName,
                            profile_picture: userData[0].profilePicture,

                        };
                        var options = {
                            token: {
                                key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                //key:"/home/techugo/Desktop/data/qouchPotato/AuthKey_G6365Q88C7.p8",
                                keyId: "G6365Q88C7",
                                teamId: "48CG7UJ7VV"
                            },
                            production: false
                        };

                        var apnProvider = new apn.Provider(options);
                        let deviceToken = userData[0].device_token;

                        var note = new apn.Notification();
                        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                        note.badge = 3;
                        note.sound = "ping.aiff";
                        note.alert = "Your account has been deactivated by admin";
                        note.payload = { result: user, type: "like" };
                        note.topic = "com.qouch.app";

                        apnProvider.send(note, deviceToken).then((result) => {
                            console.log(result, "notification send");
                            console.log(note, "test notification")
                        });
                    }  
                })
            })
        }]
    }, (err, response) => {
        callback(response.updateAccountStatusinDB);
    })
}

// Delete post by Admin
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
                    var criteria3 = {
                        postId: dbData.postId
                    }
                    userDAO.getUserDataByPost(criteria3, (err, postData) => {

                        if (postData[0].device_token != null) {
                            let user = {
                                userId: postData[0].userId.toString(),
                                userName: postData[0].userName,
                                profile_picture: postData[0].profilePicture,
                                //postId: data.postId,
                            };
                            var options = {
                                token: {
                                    key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                    //key:"/home/techugo/Desktop/data/qouchPotato/AuthKey_G6365Q88C7.p8",
                                    keyId: "G6365Q88C7",
                                    teamId: "48CG7UJ7VV"
                                },
                                production: false
                            };
    
                            var apnProvider = new apn.Provider(options);
                            let deviceToken = postData[0].device_token;
    
                            var note = new apn.Notification();
                            note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                            note.badge = 3;
                            note.sound = "ping.aiff";
                            note.alert = "Admin has been deleted your post";
                            note.payload = { result: user,};
                            note.topic = "com.qouch.app";
    
                            apnProvider.send(note, deviceToken).then((result) => {
                                console.log(result, "notification send");
                                    console.log(note, "test notification")
                            });
    
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


// Sent Notification To All User By Admin
let sentNotificationToAllUser = (data, callback) => {//console.log(data.userId);return;
    async.auto({
        checkUserExistsinDB: (cb) => {
                var dataToSet = {
                    "title" : data.title,
                    "message": data.message
                }
                userDAO.getAllUser((err, userData) => {
                    console.log(userData[0].device_token,"test")
                    for (i = 0; i < userData.length; i++) {
                            if (userData[i].device_token != null) {
                                let user = {
                                    userId: userData[0].userId.toString(),
                                    userName: userData[0].userName,
                                    profile_picture: userData[0].profilePicture,

                                };
                                var options = {
                                    token: {
                                        //key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                        key:"/home/techugo/Desktop/data/qouchPotato/AuthKey_G6365Q88C7.p8",
                                        keyId: "G6365Q88C7",
                                        teamId: "48CG7UJ7VV"
                                    },
                                    production: false
                                };

                                var apnProvider = new apn.Provider(options);
                                let deviceToken = userData[i].device_token;

                                var note = new apn.Notification();
                                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                                note.badge = 3;
                                note.sound = "ping.aiff";
                                note.alert = data.title + "  Admin sent new message";
                                note.payload = { result: user , "message": data.message };
                                note.topic = "com.qouch.app";

                                apnProvider.send(note, deviceToken).then((result) => {
                                    console.log(result, "notification send");
                                    console.log(note, "test notification")                                    
                            });
                        }
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Successfully Sent" });

             })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

//................ Analytics Data.................//

//Total post count
let postCount = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            userDAO.postCount((err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {


                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "postCount": dbData[0].postCount, "userCount": dbData[0].userCount });
                } else {
                    cb(null, {
                        "statusCode": util.statusCode.OK, "statusMessage": "User post not found"

                    })
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

//Trending Post
let trendingPost = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            userDAO.getTrendingPost((err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });

                } if (dbData && dbData.length) {

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData});
                } else {
                    cb(null, {
                        "statusCode": util.statusCode.OK, "statusMessage": "User post not found"

                    })
                }

            })
        },

    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

module.exports = {
    getAllUser,
    getUserDetails,
    getPostDetails,
    editUserByAdmin,

    getAllPost,
    addPostByAdmin,
    editPostByAdmin,
    adminDeactivateUser,
    deletePost,
    sentNotificationToAllUser,
    postCount,
    trendingPost,
}