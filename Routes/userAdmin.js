/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: November 16, 2018
*/


let express = require('express'),
    router = express.Router(),
    util = require('../Utilities/util'),
    userService = require('../Services/userAdmin');
const axios = require('axios');

var fileExtension = require('file-extension')
var crypto = require('crypto')
var multer = require('multer')
var fs = require('fs');

//var minSize = 1 * 1000 * 1000;
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/html/QouchPotato/public/docs')
    },
    filename: function (req, file, cb) {
        // if (path.size(file.originalname) !== 0) {
        //     return cb(null, false)
        //   }
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + fileExtension(file.mimetype));
        });
    }
});
let upload = multer({ storage: storage });
let cpUpload = upload.fields([{ name: 'profilePicture', maxCount: 1 }]);

//Get All User
router.get('/getAllUser', (req, res) => {
    userService.getAllUser(req.body, (data) => {
        res.send(data);
    });
});

//Get user by Admin
router.get('/getUserdetail', (req, res) => {
    console.log(req.body,"post")
    userService.getUserDetails(req.query, (data) => {
        res.send(data);
    });
});

//Get post by Admin
router.get('/getPostdetail', (req, res) => {
    console.log(req.body,"post")
    userService.getPostDetails(req.query, (data) => {
        res.send(data);
    });
})

// Update User By Admin
router.put('/editUserByAdmin',cpUpload, (req, res) => {
    userService.editUserByAdmin(req.body,req.files, (data) => {
        res.send(data);
    });
});

//Get All Posst
router.get('/getAllPost', (req, res) => {
    userService.getAllPost(req.body, (data) => {
        res.send(data);
    });
});

// Update Post By Admin
router.post('/updatePostByAdmin', (req, res) => {
    userService.editPostByAdmin(req.body, (data) => {
        res.send(data);
    });
});

// Deactivate user account by admin
router.get('/adminDeactivateUser', (req, res) => {
    userService.adminDeactivateUser(req.query, (data) => {
        res.send(data);
    });
});

// Delete post by Admin
router.get('/adminDeletePost', (req, res) => {
    userService.deletePost(req.query, (data) => {
        res.send(data);
    });
});

//Sent Notification To All User By Admin
router.post('/sentNotificationToAllUser', (req, res) => {
    userService.sentNotificationToAllUser(req.body, (data) => {
        res.send(data);
    });
});

//Total post count by Admin
router.get('/postCount', (req, res) => {
    userService.postCount(req.query, (data) => {
        res.send(data);
    });
});

//Trending post by Admin
router.get('/trendingPost', (req, res) => {
    userService.trendingPost(req.query, (data) => {
        res.send(data);
    });
});
module.exports = router;