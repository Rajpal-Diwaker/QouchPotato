/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: 18-1-2019
*/


let express = require('express'),
    router = express.Router(),
    util = require('../Utilities/util'),
    userService = require('../Services/user');
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

//limits: { fileSize: minSize }

/* User Sign Up. */
router.post('/signup', (req, res) => {
    userService.signup(req.body, (data) => {
        res.send(data);
    });
});

/* User Login. */
router.post('/login', (req, res) => {
    userService.login(req.body, (data) => {
        res.send(data);
    });
});

/* Add post API. */
router.post('/addPost', (req, res) => {
    userService.addPost(req.body, (data) => {
        res.send(data);
    });
});

/** Get all post */
router.post('/getAllPost', (req, res) => {
    userService.getPost(req.body, (data) => {
        res.send(data);
    });
});

/* User Login. */
router.post('/updateStatus', (req, res) => {
    userService.updateStatus(req.body, req.headers.access_token, (data) => {
        res.send(data);
    });
});

/** User complete profile */
router.post('/completeProfile', cpUpload, (req, res) => {
    //console.log(req, "Check db error")
    userService.completeProfile(req.body, req.files, (data) => {
        // if(req.files.profilePicture[0].size<=0){
        //     fs.unlink('public/docs/'+req.files.profilePicture[0].filename , function(err){
        //         if(err) throw err;
        //     });
        //     res.send({"statusCode": util.statusCode.FOUR_ZERO_ONE,statusMessage: 'file is too small' })
        //     return;
        //  }
        res.send(data);
    });
});

/* Code to get the list of songs in the package */
router.post('/getUserProfile', (req, res) => {
    userService.getUserProfile(req.body, (data) => {
        res.send(data);
    });
});



/*router.get('/verifyForgot', function(req, res) {
    console.log('html/reset.html');
    console.log(path.resolve('html/reset.html'));
    res.sendFile(path.resolve('html/reset.html'))
});*/

/* send OTP. */

/* API to update Profile. */
router.post('/updateProfile', cpUpload, (req, res) => {
    userService.updateProfile(req.body, req.files, (data) => {
        res.send(data);
    });
});

/* Check Fb Account */
// router.get('/verifyForgotLink', (req, res) => {
//     userService.verifyForgotLisubjectsnk(req.query, (data) => {
//         res.send(data);
//     });
// });

/* Fb Sign Up */
router.post('/LoginWithFacebook', (req, res) => {
    userService.LoginWithFacebook(req.body, (data) => {
        res.send(data);
    });
});

/* google Sign Up */
router.post('/LoginWithGoogle', (req, res) => {
    userService.LoginWithGoogle(req.body, (data) => {
        res.send(data);
    });
});

/* Change Password */
router.post('/changepassword', (req, res) => {
    userService.changePassword(req.body, (data) => {
        res.send(data);
    });
});

router.post('/likeUnlikePost', (req, res) => {
    userService.likeAndUnLike(req.body, (data) => {
        res.send(data);
    });
});

/* Update Settings Of User*/
router.post('/logOut', (req, res) => {
    userService.logOut(req.body, (data) => {
        res.send(data);
    });
});

router.post('/updateDevicetoken', (req, res) => {
    userService.updateDevicetoken(req.body, (data) => {
        res.send(data);
    });
});

router.get('/verifyForgotLink', (req, res) => {
    userService.verifyForgotLink(req.query, (data) => {
        if (data.statusCode == 200) {
            var userData = {
                status: "success",
                msg: "Please update your passport here.",
                email: data.email
            }
        }
        else {
            var userData = {
                status: "failure",
                msg: data.statusMessage
            }
        }
        res.render('forgot_password', userData);
    });

})

/* Code to verify email at the time of registration */
router.get('/emailVerification', (req, res) => {
    userService.emailVerification(req.query, (data) => {
       // console.log(data);
        if (data.statusCode == 200) {
            var userData = {
                status: "success",
                email: data.email
            }
        }
        else if (data.statusCode == 1) {
            var userData = {
                status: "already_verified",
                email: data.email
            }
        }
        else {
            var userData = {
                status: "failure"
            }
        }
        res.render('account_verification', userData);
    });

})

router.post('/updateForgotPassword', (req, res) => {
    userService.updateForgotPassword(req.body, (data) => {
        //console.log(data, "kdf")
        if (data.statusCode == 200) {
            res.end("200");
            //res.send(data);
        }
        else {
            res.end("400");
        }

    });
});

router.post('/forgotPassword', (req, res) => {
    userService.forgotPassword(req.body, (data) => {
        if (data.statusCode == 200) {
            //res.end("200");
            var userData = {
                statusCode: util.statusCode.OK,
                statusMessage: util.statusMessage.EMAIL_SENT
            }
        }
        else {
            var userData = {
                statusCode: util.statusCode.FOUR_ZERO_ONE,
                statusMessage: util.statusMessage.EMAIL_NOT_REGISTERED
            }
        }
        res.send(userData);
    });
});

router.post('/postComment', (req, res) => {
    userService.comment(req.body, (data) => {
        res.send(data);
    });
});

router.get('/getPostComments', (req, res) => {
    userService.getComment(req.query, (data) => {
        res.send(data);
    });
});

router.put('/updatePost', (req, res) => {
    userService.updatePost(req.body, (data) => {
        res.send(data);
    });
});

router.delete('/deletePost', (req, res) => {
    userService.deletePost(req.body, (data) => {
        res.send(data);
    });
});

router.put('/updateGenre', (req, res) => {
    userService.updateGener(req.body, (data) => {
        res.send(data);
    });
});

router.put('/updateUserGenre', (req, res) => {
    userService.updateUserGener(req.body, (data) => {
        res.send(data);
    });
});

router.post('/reportPost', (req, res) => {
    userService.postReport(req.body, (data) => {
        res.send(data);
    });
});

router.post('/followUser', (req, res) => {
    userService.follower(req.body, (data) => {
        res.send(data);
    });
});

// unfollow user /
router.post('/unfollow', (req, res) => {
    userService.unfollow(req.query, (data) => {
        res.send(data);
    });
});

router.get('/followStatus', (req, res) => {
    userService.followStatus(req.query, (data) => {
        res.send(data);
    });
});

router.post('/searchPosts', (req, res) => {
    userService.searchByHashTag(req.body, (data) => {
        res.send(data);
    });
});

router.get('/getFollowers', (req, res) => {
    userService.getFollowerList(req.query, (data) => {
        res.send(data);
    });
});

router.get('/getFollowingUsers', (req, res) => {
    userService.getFollowedList(req.query, (data) => {
        res.send(data);
    });
});

router.get('/movieList', (req, res) => {
    userService.movieList(req.body, (data) => {
        res.send(data);
    });
});

router.get('/getPickaFlick', (req, res) => {
    userService.getMovieList(req.query, (data) => {
        res.send(data);
    });
});

router.post('/getOtherProfile', (req, res) => {
    userService.getOtherProfile(req.body, (data) => {
        res.send(data);
    });
});

router.post('/postFilter', (req, res) => {
    userService.getPostfilter(req.body, (data) => {
        res.send(data);
    });
});

router.post('/saveFlick', (req, res) => {
    userService.saveFlick(req.body, (data) => {
        res.send(data);
    });
});

router.post('/getUserFlick', (req, res) => {
    userService.getUserFlick(req.body, (data) => {
        res.send(data);
    });
});

router.get('/getUserWatchList', (req, res) => {
    userService.getUserWish(req.query, (data) => {
        res.send(data);
    });
});

router.post('/searchHashTag', (req, res) => {
    userService.searchHashTag(req.body, (data) => {
        res.send(data);
    });
});

router.post('/updateWatchListItem', (req, res) => {
    userService.updateWishListItem(req.body, (data) => {
        res.send(data);
    });
});

router.post('/getTrendingPost', (req, res) => {
    userService.getTendingPost(req.body, (data) => {
        res.send(data);
    });
});

router.get('/getWhatsNew', (req, res) => {
    userService.getWhatsNewInPost(req.query, (data) => {
        res.send(data);
    });
});

router.post('/getUserGenerList', (req, res) => {
    userService.getUserGenerList(req.body, (data) => {
        res.send(data);
    });
});

router.post('/userBlock', (req, res) => {
    userService.userBlock(req.body, (data) => {
        res.send(data);
    });
});

router.post('/getBlockUserList', (req, res) => {
    userService.getUserBlockList(req.body, (data) => {
        res.send(data);
    });
});

router.post('/deactivateUserAccount', (req, res) => {
    userService.accountStatus(req.body, (data) => {
        res.send(data);
    });
});

router.get('/getUserWishDetails', (req, res) => {
    userService.getUserWishDetails(req.query, (data) => {
        res.send(data);
    });
});

router.post('/movieDataList', (req, res) => {
    userService.movieDataList(req.body, (data) => {
        res.send(data);
    });
});


router.post('/searchMovies', (req, res) => {
    userService.searchMovies(req.body, (data) => {
        res.send(data);
    });
});

router.post('/searchTvShows', (req, res) => {
    userService.searchTvShows(req.body, (data) => {
        res.send(data);
    });
});

router.post('/PickFlickByUserNature', (req, res) => {
    userService.PickFlickByUserNature(req.body, (data) => {
        res.send(data);
    });
});

router.post('/offNotification', (req, res) => {
    userService.offNotification(req.body, (data) => {
        res.send(data);
    });
});

router.post('/getNotificationList', (req, res) => {
    userService.getNotificationList(req.body, (data) => {
        res.send(data);
    });
});

module.exports = router;