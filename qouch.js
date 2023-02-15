    let app = require('express')(),
        express = require('express'),
        async = require('async'),
        server = require('http').Server(app),
        io = require('socket.io')(server),
        mustache = require('mustache')
        bodyParser = require('body-parser'),
        path = require('path'),
        cors = require('cors'),
        apn = require('apn');

        //CronJob = require('cron').CronJob;


       

    require('./Utilities/dbConfig');

    let userRoute = require('./Routes/user'),
        adminRoute = require('./Routes/userAdmin'),
        userDAO = require('./DAO/userDAO');

        userService = require('./Services/user');
        chat  = require('./Routes/chat'),
        util = require('./Utilities/util'),
        COMMON = require('./Services/common/common'),
        models = require('./models'),
        config = require("./Utilities/config").config;

    app.use("/media", express.static(path.join(__dirname, '/public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use(express.static(__dirname + '/views'));
    app.set('view engine', 'ejs');


    app.use(function(err, req, res, next) {
        return res.send({ "errorCode": util.statusCode.FOUR_ZERO_ZERO, "errorMessage": util.statusMessage.SOMETHING_WENT_WRONG });
    });


    //app.use('/', webRoute);
    app.use('/user', userRoute);
    app.use('/userChat', chat);
    app.use('/admin', adminRoute);


    var getSocketId = function(users, userId){
        console.log(userId,"post")
        console.log(users,"test")
        let socketdata;
        for (let user of users) {
            if (user.userId == userId) {
                socketdata = { userId : user.userId, socketId : user.socketId, status: user.status };
                //break;
            }
        }
        return socketdata;
    }

    /* get userId by socketId */
    var getUserId = function(users, socketId){
         console.log(socketId,"post1")
        console.log(users,"test1")
        let socketdata;
        for (let user of users) {
            if (user.socketId == socketId) {
              socketdata = { userId : user.userId, socketId : user.socketId, status: user.status };
            }
        }
        return socketdata;
    }

    var users = [];
    var pool = [];
    app.set('io', io);
    app.set('users',users);
    app.set('pool',pool);

    io.on('connection', function(socket){
        console.log('a user connected');
        console.log(io.sockets.adapter.rooms);
        socket.on('add user', function(data) { 
            console.log(data,"ambuj");
            var f = 0;
            var obj = {userId: data.userId, socketId: socket.id, status:'online'};
            users.map(function(v, i) {
                if(v.userId == data.userId) {
                    f = 1;      
                    users[i].socketId = socket.id
                    users[i].status = 'online'
                }
            })
            if(f == 0) users.push(obj);  

            //manage pool
            var p = 0;
            var poolObj = {fromUserId: data.userId, toUserId: data.toUserId, status:'link'};
            pool.map(function(v, i) {
                if(v.fromUserId == data.userId || v.toUserId == data.userId) {
                    p = 1;
                }
            })
            if(p == 0) pool.push(poolObj);
            // console.log("after connected");console.log(users);
            // console.log("pool user");console.log(pool);

            io.to(socket.id).emit('add user', {socketId : socket.id} ); //add user callback
              /*models.user.find({
                  where: { id: user }
              }).then( exist_user => {
                console.log("after connected");console.log(users);//console.log(exist_user);
            });*/
        });

        socket.on('disconnect', function(){ 

            users.filter(function(v, i) {
                if(v.socketId == socket.id) {
                    //users.splice(i, 1);
                    v.status = 'offline';
                }
            });
            var fromUserData = getUserId(users, socket.id);
            if(fromUserData){
                var userId = fromUserData.userId;
                for(var i=0 ; i<pool.length; i++)
                {
                    if(pool[i].fromUserId==userId || pool[i].toUserId==userId)
                        pool.splice(i,1);
                }   
            }
            console.log("after disconnected socket");console.log(users);
            console.log("after disconnected pool");console.log(pool);
        });

        socket.on('send message',function(data) {

            console.log("public users data:"); 
            console.log(data,"send");
            /**
             * get socketId by userId for users array
             */

            let toSocketData = getSocketId(users, data.receiver_id);
            let fromUserData = getUserId(users, socket.id);

            console.log("toSocketData:");console.log(toSocketData);
            console.log("fromUserData:");console.log(fromUserData);

            // create chat
            models.chat.create({
                sender_id: fromUserData.userId, 
                receiver_id: data.receiver_id,
                message: data.message,
                date_added: new Date(),
                //date_added:'2019-01-09 12:11:11'
            }).then( chat => {
                if(toSocketData != undefined ){
                    let linkObj = {};
                    pool.filter(function (l) {
                        if((l.fromUserId == data.userId && l.toUserId == data.receiver_id) || (l.fromUserId == data.receiver_id && l.toUserId == data.userId) && l.status == "link"){
                            return linkObj.link = "link";
                        }
                    });
                    if(toSocketData.status == 'online' && linkObj.link == "link"){
                       // console.log('emit');
                        io.to(toSocketData.socketId).emit('send message', {sender_id: fromUserData.userId, message: chat.message, date_added: chat.date_added} );
                    }else{
                      //  console.log('User is offline');
                        async.parallel({
                            receiver_profile: (cb) => {
                                models.users.find({
                                    where: { userId: data.receiver_id }
                                }).then( user => {
                                    let data = {
                                        userId: user.userId,
                                        userName: user.userName,
                                        profile_picture: user.profilePicture ?  user.profilePicture : "",
                                        device_type: user.device_type,
                                        device_token: user.device_token,
                                    }
                                    cb(null,data);
                                });
                            },
                            sender_profile: (cb) => {
                                models.users.find({
                                    where: { userId: fromUserData.userId }
                                }).then( user => {
                                    let data = {
                                        userId: user.userId,
                                        userName: user.userName,
                                        profile_picture:  user.profilePicture ?  user.profilePicture : "",
                                        device_type: user.device_type,
                                        device_token: user.device_token,
                                    }
                                    cb(null,data);
                                });
                            }
                        },(err, res) => {
                            let title = 'New message'
                            let message = res.sender_profile.userName+' has sent you a new chat message'
                            let chatData = {
                                userId: res.sender_profile.userId.toString(), 
                                userName: res.sender_profile.userName, 
                                profile_picture:  res.sender_profile.profile_picture,
                                message: chat.message, 
                                date_added: chat.date_added
                            };
                            if(res.receiver_profile.device_token != null){
                                console.log(res.receiver_profile.device_token,"Find data of user")
                                 var options = {
                                token: {
                                  key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                  keyId: "G6365Q88C7",
                                  teamId: "48CG7UJ7VV"
                                },
                                production: false
                              };
                            var dataToSet = {
                                userId : res.receiver_profile.userId.toString(),
                                title : res.sender_profile.userName.replace(/^./, res.sender_profile.userName[0].toUpperCase()) + " has sent you a new chat message",
                                type: "chat"
                            }
                            userDAO.userNotification(dataToSet, (err, dbData) => {
                                console.log(err,"postttttt")
                            })
                              var apnProvider = new apn.Provider(options);
                              let deviceToken = res.receiver_profile.device_token;
                              
                              var note = new apn.Notification();
                              //console.log(functionData.checkUserExistsinDB[0][1]);
                              note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                              note.badge = 3;
                              note.sound = "ping.aiff";
                              note.alert = res.sender_profile.userName.replace(/^./, res.sender_profile.userName[0].toUpperCase()) + " sent you a message";
                              note.payload = { 'result': chatData, 'msg': message,'title': title , type: "chat_message"};
                              note.topic = "com.qouch.app";

                              apnProvider.send(note, deviceToken).then( (result) => {
                                   console.log(result,"notification send");
                                console.log(note, "test notification")
                              });
                                
                            }
                        });
                    }
                }else{
                    console.log('User have not socket data');
                    async.parallel({
                        receiver_profile: (cb) => {
                            models.users.find({
                                where: { userId: data.receiver_id }
                            }).then( user => {
                                let data = {
                                    userId: user.userId,
                                    userName: user.userName,
                                    profile_picture: user.profilePicture ?  user.profilePicture : "",
                                    device_type: user.device_type,
                                    device_token: user.device_token,
                                }
                                cb(null,data);
                            });
                        },
                        sender_profile: (cb) => {
                            models.users.find({
                                where: { userId: fromUserData.userId }
                            }).then( user => {
                                let data = {
                                    userId: user.userId,
                                    userName: user.userName,
                                    profile_picture: user.profilePicture ?  user.profilePicture : "",
                                    device_type: user.device_type,
                                    device_token: user.device_token,
                                }
                                cb(null,data);
                            });
                        }
                    },(err, res) => {
                        let title = 'New Chat Message'
                        let message = res.sender_profile.userName+' has sent you a new chat message'
                        let chatData = {
                            userId: res.sender_profile.userId.toString(), 
                            userName: res.sender_profile.userName, 
                            profile_picture: res.sender_profile.profile_picture,
                            message: chat.message, 
                            date_added: chat.date_added
                        };
                        if(res.receiver_profile.device_token != null){
                            console.log(res.receiver_profile.device_token,"Find Notification device_token.......")
                            
                            var options = {
                                token: {
                                  key: "/var/www/html/QouchPotato/AuthKey_G6365Q88C7.p8",
                                  keyId: "G6365Q88C7",
                                  teamId: "48CG7UJ7VV"
                                },
                                production: false
                              };
                            var dataToSet = {
                                userId : res.receiver_profile.userId.toString(),
                                title : res.sender_profile.userName.replace(/^./, res.sender_profile.userName[0].toUpperCase()) + " has sent you a new chat message",
                                type: "chat"
                            }
                            userDAO.userNotification(dataToSet, (err, dbData) => {
                                //console.log(err,"postttttt")
                            })
                              var apnProvider = new apn.Provider(options);
                              let deviceToken = res.receiver_profile.device_token;
                              
                              var note = new apn.Notification();

                              note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                              note.badge = 3;
                              note.sound = "ping.aiff";
                              note.alert = res.sender_profile.userName.replace(/^./, res.sender_profile.userName[0].toUpperCase()) + " sent you a message";
                              note.payload = { 'result': chatData, 'msg': message,'title': title , type: "chat_message"};
                              note.topic = "com.qouch.app";

                              apnProvider.send(note, deviceToken).then( (result) => {
                                console.log(note, "test notification")
                                   console.log(result,"check Notification errorMessage");
                            });
                        }
                    });
                }
                if(fromUserData != undefined){
                    if(fromUserData.status == 'online'){
                        io.to(fromUserData.socketId).emit('send message', {sender_id: fromUserData.userId, message: chat.message, date_added: chat.date_added} );
                    }
                }
            });
        });

        socket.on('get chat messages', function(data) {

            //Emit this event to all clients connected to it
            let userData = getUserId(users, socket.id);
            console.log(userData);
            //let friendData = getSocketId(users, data.userId);
            // if(data.limit){
            //     limit = data.limit;
            // }else{
            //     limit = 30;
            // }
            // if(data.offset){
            //     offset = data.offset;
            // }else{
            //     offset = 0;
            // }
            let chathistory = "SELECT `chat`.`sender_id`, `chat`.`message` as `message`, `chat`.`date_added` FROM `chat` as `chat` WHERE (`chat`.`sender_id` = ? AND `chat`.`receiver_id` = ?) OR (`chat`.`sender_id` = ? AND `chat`.`receiver_id` = ?) order by `chat`.`id` desc ";

            models.sequelize.query( chathistory, { 
            replacements: [userData.userId, data.userId, data.userId, userData.userId], type: models.sequelize.QueryTypes.SELECT 
            }).then( chat => { 
                console.log(chat);
                /*chat.map(function(v,i){
                    if(v.media != null){
                        chat[i].media = CONSTANT.PROTOCOL+CONSTANT.HOST+':'+CONSTANT.PORT+'/public/uploads/'+chat[i].media
                    }
                });*/
                io.to(userData.socketId).emit('get chat messages', {chat: chat} );               
            });     
        });
    });

    /*first API to check if server is running*/
    // app.get('/', function(req, res) {
    //     res.send('hello, world!');
    // });
    app.get('/', (req, res) => {
        res.render('chat')
    })

    // new CronJob('1 * * * * *', function() {
    //     userService.movieList({}, (data) => {            
    //         console.log('status updated succesfully');
    //     });
    // // console.log("staring cron");
    // }, null, true, 'America/Los_Angeles');
 


    /*first API to check if server is running*/
    // app.get('/', function(req, res) {
    //     res.send('hello, world!');
    // });

    server.listen(config.NODE_SERVER_PORT.port,function(){
    	console.log('Server running on port '+ config.NODE_SERVER_PORT.port);
    });
