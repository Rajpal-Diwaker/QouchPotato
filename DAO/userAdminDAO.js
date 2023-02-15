'use strict';

let dbConfig = require("../Utilities/dbConfig");


//Get All User By Admin
let getAllUser = (callback) => {

    dbConfig.getDB().query(`select userId,facebook_id,google_id,userName,email,profilePicture,gender,age,location,des,api_token,profileStatus,login_status,accountStatus,device_token from user where 1 `, callback);
}

//Get user By Admin 
let getUsers = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `user.userId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select user.*, user_genre.genre from user INNER JOIN user_genre ON user.userId = user_genre.userId  where ${conditions}`, callback);
    console.log(`select userId,facebook_id,google_id,userName,email,profilePicture,gender,age,location,des,api_token,profileStatus,login_status,accountStatus from user where ${conditions}`, "orieoere");
}

//Get post By Admin
let getPostDetail = (criteria, callback) => {
    let conditions = "";
   criteria.postId ? conditions += `post.postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*, u.userName , g.genre, c.comment,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment

   FROM post

   left join user as u on  u.userId = post.userId
   
   left join post_genre as g on g.postId = post.postId

   left join like_Unlike as l on l.postId = post.postId  

   left join comment as c on c.postId = post.postId

   WHERE ${conditions}`, callback)
    // let conditions = "";

    // criteria.postId ? conditions += ` post.postId = '${criteria.postId}'` : true;

    // dbConfig.getDB().query(`select post.*,post_genre.genre from post INNER JOIN post_genre ON post.postId = post_genre.postId where  ${conditions} AND post.postStatus = "active"`, callback);
    // console.log(`select post.*,post_genre.genre from post INNER JOIN post_genre ON post.postId = post_genre.postId where  ${conditions} AND post.postStatus = "active"`)
}

//Edit User By Admin
let updateUser = (criteria, dataToSet, callback) => {

    //update keys
    let setData = "";
    dataToSet.userName ? setData += `userName = '${dataToSet.userName}'` : true;
    dataToSet.location ? setData += `,location = '${dataToSet.location}'` : true;
    dataToSet.gender ? setData += `,gender = '${dataToSet.gender}'` : true;
    dataToSet.age ? setData += `,age = '${dataToSet.age}'` : true;
    dataToSet.des ? setData += `,des = '${dataToSet.des}'` : true;//setData+=`,des = ''`;
    dataToSet.profilePicture ? setData += `,profilePicture = '${dataToSet.profilePicture}'` : true;
    dataToSet.password ? setData += `password = '${dataToSet.password}'` : true;
    dataToSet.profileStatus ? setData += `profileStatus = '${dataToSet.profileStatus}'` : true;
    dataToSet.login_status ? setData += `,login_status ='${dataToSet.login_status}'` : true;
    dataToSet.device_token ? setData += `,device_token = '${dataToSet.device_token}'` : true;
    dataToSet.forgot_token ? setData += ` forgot_token = '${dataToSet.forgot_token}'` : true;

    let conditions = "";
    criteria.userId ? conditions += `AND userId ='${criteria.userId}'` : true;
    criteria.email ? conditions += `AND email ='${criteria.email}'` : true;
    criteria.userName ? conditions += `AND userName ='${criteria.userName}'` : true;


    dbConfig.getDB().query(`UPDATE user SET ${setData} where 1 ${conditions} `, callback);
    //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

//Edit User Genre
let updateUserGener = (criteria, dataToSet2, callback) => {
    let setData = "";
    dataToSet2.genre ? setData += `genre = '${dataToSet2.genre}'` : true;
    let conditions = "";
    criteria.userId ? conditions += `and userId ='${criteria.userId}'` : true;

    dbConfig.getDB().query(`UPDATE user_genre SET ${setData} where 1 ${conditions} `, callback);
    //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

//Get All Post Admin
let getAllPost = (callback) => {

    dbConfig.getDB().query(`select * from post where 1 AND postStatus = "active"`, callback);
}

//Get total post count
let postCount = (callback) => {

    dbConfig.getDB().query(`select post.postId,post.postStatus,
    (SELECT COUNT( postId ) FROM post WHERE post.postId AND post.postStatus = "active") as postCount,
    (SELECT COUNT( userId ) FROM user WHERE user.userId) as userCount

    from post 
    left join user on user.userId = post.userId 
    where 1 AND postStatus = "active"`, callback);
}

//Get trending post
let getTrendingPost = ( callback) => {
   
    dbConfig.getDB().query(`SELECT distinct post.*, g.genre,user.userName,
 
    (SELECT COUNT( postId ) FROM post WHERE post.postId AND post.postStatus = "active") as trendingCount,
 
    (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
    (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
    FROM post
    left join post_genre as g on g.postId = post.postId 
    left join user on user.userId = post.userId 
    WHERE post.postStatus='active' AND user.accountStatus = 'Active' ORDER BY postLike DESC, comment DESC limit 20 `, callback)
 
}

//Get user data
let getUser = (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += `and userId = '${criteria.userId}'` : true; 
 
    dbConfig.getDB().query(`select userId,facebook_id,google_id,userName,email,profilePicture,gender,age,
    location,des,api_token,profileStatus,login_status,accountStatus,device_token from user 
    where 1 ${conditions}`, callback);
    //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
 }
//Get user data through 
let getUserDataByPost = (criteria3, callback) => {
    let conditions = "";
    criteria3.postId ? conditions += `and g.postId = '${criteria3.postId}'` : true; 
 
    dbConfig.getDB().query(`select user.*,g.* from user 
    left join post as g on g.userId = user.userId 
    where 1 ${conditions}`, callback);
}
 
//Get Single Post By Admin
let getSinglePost = (criteria, callback) => {

    let conditions = "";

    criteria.postId ? conditions += ` postId = '${criteria.postId}'` : true;

    dbConfig.getDB().query(`select * from post where ${conditions}`, callback);
    console.log(`select * from post where ${conditions}`)

}

//Get Genre By Admin
let getGener = (criteria, callback) => {
    let conditions = "";

    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

    dbConfig.getDB().query(`select postId,genre from post_genre where 1 ${conditions}`, callback);
    //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

//Get Hash Tag By Admin
let getHashTag = (criteria, callback) => {
    let conditions = "";

    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

    dbConfig.getDB().query(`select postId,hashtags from post_hashtag where 1 ${conditions}`, callback);
    //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

// Get active post by admin
let getActivePost = (criteria, callback) => {
    let conditions = "";
 
    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
 
    dbConfig.getDB().query(`select postId, postStatus from post where 1 ${conditions} `, callback);
 
 
 }
 
//Update Post By Admin 
let updatePost = (criteria, dataToSet, callback) => {

    //update keys
    let setData = "";
    dataToSet.link ? setData += `link = '${dataToSet.link}'` : true;
    dataToSet.title ? setData += `,title = '${dataToSet.title}'` : true;
    dataToSet.expression_code ? setData += `,expression_code = '${dataToSet.expression_code}'` : true;
    dataToSet.expression ? setData += `,expression = '${dataToSet.expression}'` : true;
    dataToSet.platform ? setData += `,platform = '${dataToSet.platform}'` : true;
    dataToSet.activity ? setData += `,activity = '${dataToSet.activity}'` : true;


    let conditions = "";
    criteria.postId ? conditions += `AND postId ='${criteria.postId}'` : true;


    dbConfig.getDB().query(`UPDATE post SET ${setData} where 1 ${conditions} `, callback);
    //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

//Update Genre By Admin
let updateGener = (criteria, dataToSet, callback) => {
    //update keys
    let setData = "";
    dataToSet.genre ? setData += `genre = '${dataToSet.genre}'` : true;
    let conditions = "";
    criteria.postId ? conditions += `and postId ='${criteria.postId}'` : true;

    dbConfig.getDB().query(`UPDATE post_genre SET ${setData} where 1 ${conditions} `, callback);
    //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

//Update Hash Tag By Admin
let updateHashTag = (criteria, dataToSet, callback) => {

    //update keys
    let setData = "";
    dataToSet.hashtags ? setData += `hashtags = '${dataToSet.hashtags}'` : true;

    let conditions = "";
    criteria.postId ? conditions += `AND postId ='${criteria.postId}'` : true;

    dbConfig.getDB().query(`UPDATE post_hashtag SET ${setData} where 1 ${conditions} `, callback);
    //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

let getUserAccountStatus = (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select userId,accountStatus from user where 1 ${conditions}`, callback);
}

let updateAccountStatus = (criteria, dataToSet, callback) => {
    //update keys
    let setData = "";
    dataToSet.accountStatus ? setData += `accountStatus = '${dataToSet.accountStatus}'` : true;
    let conditions = "";
    criteria.userId ? conditions += `and userId ='${criteria.userId}'` : true;

    dbConfig.getDB().query(`UPDATE user SET ${setData} where 1 ${conditions} `, callback);
    //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

let updatePostStatus = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
 
    dataToSet.postStatus ? setData += `postStatus = '${dataToSet.postStatus}'` : true;
 
    dbConfig.getDB().query(`UPDATE post SET ${setData} where 1 ${conditions}`);
    //console.log(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`)
 }

let deletePost = (criteria, callback) => {
    let conditions = "";
    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
 
    dbConfig.getDB().query(`DELETE FROM post WHERE  1 ${conditions}`, callback);
    //console.log(`DELETE FROM post WHERE  1 ${conditions}`, "oooo")
 }

module.exports = {
    getAllUser,
    getUsers,
    getUser,
    getPostDetail,
    getActivePost,
    updateUser,
    updateUserGener,
    getAllPost,
    getSinglePost,
    getGener,
    getHashTag,
    updatePost,
    updateGener,
    updateHashTag,
    updatePostStatus,
    getUserAccountStatus,
    updateAccountStatus,
    deletePost,
    postCount,
    getTrendingPost,
    getUserDataByPost,
}
