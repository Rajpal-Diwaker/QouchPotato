'use strict';

let dbConfig = require("../Utilities/dbConfig");

let userNotification = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into notification set ? ", dataToSet, callback);

}

let createUser = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into user set ? ", dataToSet, callback);

}

let addPost = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into post set ? ", dataToSet, callback);
   //console.log("insert into post set ? ", dataToSet)

}

let addGener = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into post_genre set ? ", dataToSet, callback);
   // console.log("insert into post_genre set ? ", dataToSet)

}

let addHashTag = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into post_hashtag set ? ", dataToSet, callback);
   //console.log("insert into post_hashtag set ? ", dataToSet)

}

let addlike = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into like_Unlike set ? ", dataToSet, callback);
   //console.log("insert into like_Unlike set ? ", dataToSet)
}

let addComment = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into comment set ? ", dataToSet, callback);
   //console.log("insert into comment set ? ", dataToSet)

}

let addReport = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into post_report set ? ", dataToSet, callback);
   //console.log("insert into post_report set ? ", dataToSet)

}

let addFollower = (dataToSet, callback) => {
   // console.log(dataToSet);
   dbConfig.getDB().query("insert into follower_followed set ? ", dataToSet, callback);
}

let addUserGenre = (dataToSet2, callback) => {
   // console.log(dataToSet);
   dbConfig.getDB().query("insert into user_genre set ? ", dataToSet2, callback);
}

let addBlockUser = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into user_block set ? ", dataToSet, callback);
   // console.log("insert into user_block set ? ", dataToSet)

}

let movieList = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into movieList set ? ", dataToSet, callback);
   //console.log("insert into movieList set ? ", dataToSet)

}

let saveFlick = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into user_flicks set ? ", dataToSet, callback);
   //console.log("insert into post set ? ", dataToSet)

}

let saveMovieUserGenre = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into user_movie_genre (userId, genre) VALUES  ? ", [dataToSet], callback);

   console.log("insert into user_movie_genre (userId, genre) VALUES  ? ", [dataToSet], dataToSet)

}

let saveWishList = (dataToSet, callback) => {
   dbConfig.getDB().query("insert into user_wishList set ? ", dataToSet, callback);
   console.log("insert into user_wishList set ? ", dataToSet)

}

let movie = (dataToSet, callback) => {

   dataToSet.original_title = dataToSet.original_title.replace(/'/g, "\\'")
   dataToSet.original_title = dataToSet.original_title.replace(/"/g, "\\'")
   dataToSet.overview = dataToSet.overview.replace(/'/g, "\\'")
   dataToSet.overview = dataToSet.overview.replace(/"/g, '\\"')
   dataToSet.title = dataToSet.title.replace(/'/g, "\\'")
   dataToSet.title = dataToSet.title.replace(/"/g, '\\"')
   // dataToSet.video = dataToSet.video.replace('false',/,/g, '\\"')

   var query = `INSERT INTO movieList (adult, backdrop_path, genre_ids, id, original_language, original_title, 
      overview,poster_path,release_date,title,video,vote_average,vote_count,popularity) VALUES(
      '${dataToSet.adult}','${dataToSet.backdrop_path}', 
      '${dataToSet.genre_ids}','${dataToSet.id}', '${dataToSet.original_language}', '${dataToSet.original_title}', 
      '${dataToSet.overview}','${dataToSet.poster_path}','${dataToSet.release_date}','${dataToSet.title}',
      '${dataToSet.video}','${dataToSet.vote_average}','${dataToSet.vote_count}','${dataToSet.popularity}') 
      ON DUPLICATE KEY UPDATE adult='${dataToSet.adult}',
      backdrop_path='${dataToSet.backdrop_path}'`;
   dbConfig.getDB().query(query, callback);
   //console.log(query, "Ambuj0000")
}

let unlike = (criteria, callback) => {
   //  let setData = "";
   //  dataToSet.likeStatus ? setData += ` likeStatus = '${dataToSet.likeStatus}'` : true;

   let conditions = "";
   criteria.postId ? conditions += `and postId ='${criteria.postId}'` : true;
   criteria.userId ? conditions += `and userId ='${criteria.userId}'` : true;


   dbConfig.getDB().query(`DELETE FROM like_Unlike where 1 ${conditions} `, callback);
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

let updateUsers = (criteria, dataToSet, callback) => {

   //update keys
   let setData = "";
   dataToSet.location ? setData += `location = '${dataToSet.location}'` : true;
   dataToSet.gender ? setData += `,gender = '${dataToSet.gender}'` : true;
   dataToSet.age ? setData += `,age = '${dataToSet.age}'` : true;
   dataToSet.des ? setData += `,des = '${dataToSet.des}'` : true;//setData+=`,des = ''`;
   dataToSet.profilePicture ? setData += `,profilePicture = '${dataToSet.profilePicture}'` : true;

   let conditions = "";
   criteria.userId ? conditions += `AND userId ='${criteria.userId}'` : true;


   dbConfig.getDB().query(`UPDATE user SET ${setData} where 1 ${conditions} `, callback);
   //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

let updateUserDevicetoken = (criteria, dataToSet, callback) => {

   let setData = "";
   dataToSet.device_token ? setData += `device_token = '${dataToSet.device_token}'` : true;
   dataToSet.device_type ? setData += `,device_type = '${dataToSet.device_type}'` : true;

   let conditions = "";
   criteria.userId ? conditions += `AND userId ='${criteria.userId}'` : true;

   dbConfig.getDB().query(`UPDATE user SET ${setData} where 1 ${conditions} `, callback);
}

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

let updateGener = (criteria, dataToSet, callback) => {
   //update keys
   let setData = "";
   dataToSet.genre ? setData += `genre = '${dataToSet.genre}'` : true;
   let conditions = "";
   criteria.postId ? conditions += `and postId ='${criteria.postId}'` : true;

   dbConfig.getDB().query(`UPDATE post_genre SET ${setData} where 1 ${conditions} `, callback);
   //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

let updateUserGener = (criteria, dataToSet, callback) => {
   //update keys
   let setData = "";
   dataToSet.genre ? setData += `genre = '${dataToSet.genre}'` : true;
   let conditions = "";
   criteria.userId ? conditions += `and userId ='${criteria.userId}'` : true;

   dbConfig.getDB().query(`UPDATE user_genre SET ${setData} where 1 ${conditions} `, callback);
   //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

let updateHashTag = (criteria, dataToSet, callback) => {

   //update keys
   let setData = "";
   dataToSet.hashtags ? setData += `hashtags = '${dataToSet.hashtags}'` : true;

   let conditions = "";
   criteria.postId ? conditions += `AND postId ='${criteria.postId}'` : true;

   dbConfig.getDB().query(`UPDATE post_hashtag SET ${setData} where 1 ${conditions} `, callback);
   //console.log(`UPDATE user SET ${setData} where 1 ${conditions} `,"pass");
}

let removeDeviceToken = (criteria, dataToSet, callback) => {
   //update keys
   let setData = "";
   dataToSet.device_token ? setData += `device_token = '${dataToSet.device_token}'` : true;
   let conditions = "";
   criteria.userId ? conditions += `userId ='${criteria.userId}'` : true;

   dbConfig.getDB().query(`UPDATE user SET ${setData} where ${conditions} `, callback);
   console.log(`UPDATE user SET ${setData} where ${conditions} `,"pass");
}

let updateFollowStatus = (criteria, dataToSet, callback) => {
   let conditions = "";
   let setData = "";
   criteria.followerId ? conditions += ` and followerId = '${criteria.followerId}'` : true;
   criteria.followedId ? conditions += ` and followedId = '${criteria.followedId}'` : true;

   dataToSet.followStatus ? setData += `followStatus = '${dataToSet.followStatus}'` : true;

   dbConfig.getDB().query(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`);
   //console.log(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`)
}

let deletefollowed = (criteria, callback) => {
   let conditions = "";
   criteria.followerId ? conditions += ` and followerId = '${criteria.followerId}'` : true;
   criteria.followedId ? conditions += ` and followedId = '${criteria.followedId}'` : true;

   dbConfig.getDB().query(`DELETE FROM follower_followed WHERE  1 ${conditions}`, callback);
   //console.log(`DELETE FROM follower_followed WHERE  1 ${conditions}`, "oooo")
}

let unblockUser = (criteria, callback) => {
   let conditions = "";
   criteria.fromUserId ? conditions += ` and fromUserId = '${criteria.fromUserId}'` : true;
   criteria.toUserId ? conditions += ` and toUserId = '${criteria.toUserId}'` : true;

   dbConfig.getDB().query(`DELETE FROM user_block WHERE  1 ${conditions}`, callback);
   //console.log(`DELETE FROM user_block WHERE  1 ${conditions}`, "oooo")
}

let deletePost = (criteria, callback) => {
   let conditions = "";
   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`DELETE FROM post WHERE  1 ${conditions}`, callback);
   //console.log(`DELETE FROM post WHERE  1 ${conditions}`, "oooo")
}

let deleteWish = (criteria, callback) => {
   let conditions = "";
   criteria.wishId ? conditions += ` and wishId = '${criteria.wishId}'` : true;

   dbConfig.getDB().query(`DELETE FROM user_wishList WHERE  1 ${conditions}`, callback);
   //console.log(`DELETE FROM post WHERE  1 ${conditions}`, "oooo")
}

let updateWatchStatus = (criteria, dataToSet, callback) => {
   let conditions = "";
   let setData = "";
   criteria.wishId ? conditions += ` and wishId = '${criteria.wishId}'` : true;

   dataToSet.watchStatus ? setData += `watchStatus = '${dataToSet.watchStatus}'` : true;

   dbConfig.getDB().query(`UPDATE user_wishList SET ${setData} where 1 ${conditions}`);
   //console.log(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`)
}

let updatePostStatus = (criteria, dataToSet, callback) => {
   let conditions = "";
   let setData = "";
   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

   dataToSet.postStatus ? setData += `postStatus = '${dataToSet.postStatus}'` : true;

   dbConfig.getDB().query(`UPDATE post SET ${setData} where 1 ${conditions}`);
   //console.log(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`)
}

let getUserById = (id, callback) => {
   dbConfig.findById(id, callback)
}

let getUserMovieGenre = (criteria, callback) => {
   console.log(criteria, "row")
   let conditions = "";

   criteria.userId ? conditions += ` userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`SELECT genre,COUNT(genre)as generCount FROM user_movie_genre  where  ${conditions}  GROUP BY genre  ORDER by generCount desc`, callback)
   console.log(`SELECT genre,COUNT(genre)as generCount FROM user_movie_genre  where  ${conditions}  GROUP BY genre  ORDER by generCount desc`)
}

let getUsers = (criteria, callback) => {
   let conditions = "";
   criteria.email ? conditions += ` and email = '${criteria.email}'` : true;
   criteria.userName ? conditions += ` and userName = '${criteria.userName}'` : true;
   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
   criteria.password ? conditions += ` and password = '${criteria.password}'` : true;
   criteria.facebook_id ? conditions += ` and facebook_id = '${criteria.facebook_id}'` : true;
   criteria.google_id ? conditions += ` and google_id = '${criteria.google_id}'` : true;
   criteria.forgot_token ? conditions += ` and forgot_token = '${criteria.forgot_token}'` : true;
   criteria.api_token ? conditions += ` and forgot_token = '${criteria.api_token}'` : true;
   criteria.login_status ? conditions += ` and login_status = '${criteria.login_status}'` : true;


   dbConfig.getDB().query(`select userId,facebook_id,google_id,userName,email,profilePicture,gender,age,location,des,api_token,profileStatus,login_status,accountStatus from user where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

let getUserProfile = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += ` and user.userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select user.userId,user.facebook_id,user.google_id,user.userName,user.email,
   user.profilePicture,user.gender,user.age,user.location,user.des,user.api_token,user.profileStatus,
   user.login_status,post.postId,post.userId,post.link,post.title,post.expression_code,post.expression,
   post.platform,post.activity from post INNER JOIN user ON post.userId = user.userId where 1 ${conditions}`, callback);
   // console.log(`select user.userId,user.facebook_id,user.google_id,user.userName,user.email,user.profilePicture,user.gender,user.age,user.location,user.des,user.api_token,user.profileStatus,user.login_status,post.postId,post.userId,post.link,post.title,post.expression_code,post.expression,post.platform,post.activity from post INNER JOIN user ON post.userId = user.userId where 1 ${conditions}`, "Set Data");
}

let getActivePost = (criteria, callback) => {
   let conditions = "";

   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`select postId, postStatus from post where 1 ${conditions} `, callback);


}

let sentPostData = (criteria2, callback) => {
   // let conditions = "";
   // criteria2.userId ? conditions += `post.userId = '${criteria2.userId}'` : true;
   // let conditions1 = "";
   // criteria2.userId ? conditions1 += `followerId = '${criteria2.userId}'` : true;
   // let conditions2 = "";
   // criteria2.userId ? conditions2 += `l.userId = '${criteria2.userId}'` : true;
   let conditions3 = "";
   criteria2.postId ? conditions3 += `post.postId = '${criteria2.postId}'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*, c.comment,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment

   FROM post

   left join like_Unlike as l on l.postId = post.postId  

   left join comment as c on c.postId = post.postId

   WHERE ${conditions3}`, callback)
   //console.log(conditions1)
   // dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,

   // COALESCE( user.profilePicture ,'')  AS profilePicture,

   // COALESCE(l.likeStatus ,'unlike')  AS likeStatus ,

   // COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,

   // COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,

   // (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,

   // (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike
   // FROM post
   // left join post_genre as g on g.postId = post.postId 
   // left join user_block on user_block.fromUserId = '${criteria2.userId}' AND user_block.toUserId = post.userId
   // left join user on user.userId = post.userId 
   // left join follower_followed on follower_followed.followerId = '${criteria2.userId}' AND follower_followed.followedId = user.userId
   // left join like_Unlike as l on l.postId = post.postId AND ${conditions2} WHERE 
   // ((post.userId IN
   // (SELECT followedId FROM follower_followed WHERE ${conditions1})
   // )
   // OR ${conditions} ) AND post.postStatus='active' AND user.accountStatus = 'Active'  ORDER BY post.createdAt DESC`, callback)


}

let sentPostLikeData = (criteria2, callback) => {

   let conditions3 = "";
   criteria2.postId ? conditions3 += `post.postId = '${criteria2.postId}'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*, l.likeStatus,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment

   FROM post

   left join like_Unlike as l on l.postId = post.postId  

   left join comment as c on c.postId = post.postId

   WHERE ${conditions3}`, callback)

}

let getPost = (criteria, callback) => {
   let conditions = "";
   let conditions1 = "";

   criteria.userId ? conditions += `  user.userId = '${criteria.userId}'` : true;
   criteria.userId ? conditions1 += `  userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select  post.postId,post.link,post.title,post.platform,post.expression_code,

   post.expression,post.activity,post.createdAt,user.userName,user.email,
   
   COALESCE( user.profilePicture ,'') AS profilePicture,

   COALESCE((SELECT likeStatus FROM like_Unlike WHERE postId = post.postId AND ${conditions1}),'unlike') as likeStatus,

   COALESCE((SELECT genre FROM post_genre WHERE postId = post.postId )) as genre,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,

   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike

   from post INNER JOIN user ON post.userId = user.userId where  ${conditions}  AND post.postStatus='active'  ORDER BY post.createdAt DESC `, callback);


}

let getGener = (criteria, callback) => {
   let conditions = "";

   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`select postId,genre from post_genre where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

let getUserGener = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select userId,genre from user_genre where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

let getHashTag = (criteria, callback) => {
   let conditions = "";

   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`select postId,hashtags from post_hashtag where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

let getPostListing = (callback) => {
   let conditions = "";
   //criteria.userId ? conditions += ` and user.userId = '${criteria.userId}'` : true;
   dbConfig.getDB().query(`select post.postId,post.userId,post.link,post.title,post.expression_code,

    post.expression,post.platform,post.activity,post.createdAt,

    user.userName,user.profilePicture,ph.hashtags,pg.genre ,

    (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,

    (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike

    from post INNER JOIN user ON post.userId = user.userId 

    left join post_hashtag as ph on post.postId=ph.postId  

    left join post_genre as pg on post.postId=pg.postId where 1`, callback)

   //(SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as like

   // dbConfig.getDB().query(`select post.postId,post.userId,post.link,post.title,post.expression_code,
   // post.expression,post.platform,post.activity,post.createdAt,
   // user.userName,user.profilePicture,ph.hashtags,pg.genre 
   // (SELECT COUNT( commentId ) as comment FROM comment WHERE postId = comment.postId)
   // from post INNER JOIN user ON post.userId = user.userId 
   // left join post_hashtag as ph on post.postId=ph.postId  
   // left join post_genre as pg on post.postId=pg.postId where 1`, callback);
   // dbConfig.getDB().query(`select post.userId,post.link,post.title,post.expression_code,post.expression,post.platform,post.activity,user.userName,user.profilePicture from post INNER JOIN user ON post.userId = user.userId where 1 ${conditions}`, callback);
   // console.log(`select post.userId,post.link,post.title,post.expression_code,post.expression,post.tag,post.activity,user.userName,user.profilePicture from post INNER JOIN user ON post.userId = user.userId where 1 ${conditions}`,"sdsdsdsdsdsdsd")
}

let getLike = (criteria, callback) => {
   let conditions = "";

   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select userId,postId,likeId,likeStatus from like_Unlike where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

let getComment = (criteria, callback) => {
   let conditions = "";

   criteria.postId ? conditions += `and postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`select comment.commentId,comment.userId,comment.postId,comment.comment,comment.created_at,user.userName,user.profilePicture from comment INNER JOIN user ON comment.userId = user.userId where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");    
}

let getfollowId = (criteria, callback) => {
   let conditions = "";

   conditions += (` followerId = '${criteria.followerId}' AND followedId = '${criteria.followedId}' AND followStatus = 'true'`);
   //console.log(conditions)

   dbConfig.getDB().query(`select relationId from follower_followed where ${conditions}`, callback);
   // console.log(`select relationId from follower_followed where ${conditions}`)
}

let getAddFollower = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += `and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select userName from user where 1 ${conditions}`, callback);
   //console.log(`select userName from user where 1 ${conditions}`)
}

let getUnfollow = (criteria, callback) => {
   let conditions = "";

   criteria.followerId ? conditions += `and followerId = '${criteria.followerId}'` : true;
   criteria.followedId ? conditions += `and followedId = '${criteria.followedId}'` : true;
   //console.log(conditions)

   dbConfig.getDB().query(`select followerId,followedId,followStatus from follower_followed where ${conditions}`, callback);
   console.log(`select followerId,followedId,followStatus from follower_followed where ${conditions}`)
}

let getFollowStatus = (criteria, callback) => {
   let conditions = "";

   criteria.followedId ? conditions += `and followedId = '${criteria.followedId}'` : true;
   criteria.followerId ? conditions += `and followerId = '${criteria.followerId}'` : true;

   dbConfig.getDB().query(`SELECT * FROM follower_followed WHERE 1 ${conditions}`, callback);
   //console.log(`SELECT * FROM follower_followed WHERE 1 ${conditions}`)
}

let getUnfollowStatus = (criteria, callback) => {
   let conditions = "";

   criteria.followerId ? conditions += `and followerId = '${criteria.followerId}'` : true;
   criteria.followedId ? conditions += `and followedId = '${criteria.followedId}'` : true;

   dbConfig.getDB().query(`SELECT followStatus FROM follower_followed WHERE 1  ${conditions}`, callback);
   //console.log(`SELECT count(followedId) FROM follower_followed WHERE followerId 1 ${conditions}`)
}

let getHashTags = (criteria1, callback) => {
   let conditions1 = "";
   criteria1.search ? conditions1 += `AND ph.hashtags like '%${criteria1.search},%'` : true;

   //dbConfig.getDB().query(`select * from user where  ${conditions}`,callback)
   //criteria.hashTag ? conditions += ` hashTag like  '%${criteria.hashTag}%'` : true;
   // console.log(criteria1)
   dbConfig.getDB().query(`SELECT distinct post.*,ph.hashtags,pg.genre,user.userName,
   COALESCE( user.profilePicture ,'') AS profilePicture,
   COALESCE(l.likeStatus ,'unlike') AS likeStatus ,
    (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
    
    (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
    FROM post
    left join user on user.userId = post.userId 
    left join post_hashtag as ph on ph.postId =post.postId
    left join post_genre as pg on pg.postId =post.postId
    left join like_Unlike as l on l.postId = post.postId WHERE 
    post.postStatus='active' AND user.accountStatus = 'Active' ${conditions1}`, callback);


}

let getSearchHashTag = (criteria, callback) => {
   let conditions = "";
   criteria.search ? conditions += `and ph.hashtags like '%${criteria.search},%'` : true;

   let conditions1 = "";
   criteria.userId ? conditions1 += ` and userId = ${criteria.userId}` : true;

   //dbConfig.getDB().query(`select * from user where  ${conditions}`,callback)
   //criteria.hashTag ? conditions += ` hashTag like  '%${criteria.hashTag}%'` : true;
   // console.log(criteria)
   dbConfig.getDB().query(`SELECT distinct post.*,ph.hashtags,pg.genre,user.userName,

   COALESCE( user.profilePicture ,'') AS profilePicture,

   COALESCE(l.likeStatus ,'unlike') AS likeStatus ,

   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,

    (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
    
    (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
    FROM post
    left join user on user.userId = post.userId 
    left join post_hashtag as ph on ph.postId =post.postId
    left join post_genre as pg on pg.postId =post.postId
    left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId = user.userId
    left join like_Unlike as l on l.postId = post.postId AND l.userId = '${criteria.userId}' WHERE 
    post.postStatus='active' AND user.accountStatus = 'Active'  ${conditions}`, callback);


}

let getSearch = (criteria, callback) => {

   let conditions = "";
   criteria.search = criteria.search.replace("'", "\\'")
   criteria.search = criteria.search.replace(/\u20b9/g, '"')


   // console.log("ABC",criteria.search)
   criteria.search ? conditions += `AND userName  like '%${criteria.search}%'` : true;

   let conditions1 = "";
   criteria.search ? conditions1 += `OR ph.hashtags like '%${criteria.search}%'` : true;

   let conditions2 = "";
   criteria.userId ? conditions2 += ` and userId = '${criteria.userId}'` : true;
   //dbConfig.getDB().query(`select * from user where  ${conditions}`,callback)
   //criteria.hashTag ? conditions += ` hashTag like  '%${criteria.hashTag}%'` : true;
   // console.log(criteria)
   dbConfig.getDB().query(`SELECT distinct post.*,ph.hashtags,pg.genre,user.userName,
   COALESCE( user.profilePicture ,'') AS profilePicture,
   COALESCE(l.likeStatus ,'unlike') AS likeStatus ,
   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,
   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,

   (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
   
   (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join user on user.userId = post.userId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join post_hashtag as ph on ph.postId =post.postId
   left join post_genre as pg on pg.postId =post.postId
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId = user.userId
   left join like_Unlike as l on l.postId = post.postId AND l.userId = '${criteria.userId}' WHERE 
   post.postStatus='active' AND user.accountStatus = 'Active' ${conditions} ${conditions1}`, callback);

}

let getFollower = (criteria, callback) => {
   let conditions = "";

   criteria.followerId ? conditions += `and followerId = '${criteria.followerId}'` : true;

   dbConfig.getDB().query(`SELECT COUNT( followedId) as follower FROM follower_followed WHERE followerId  ${conditions}`, callback);
   //console.log(`SELECT count(followedId) FROM follower_followed WHERE followerId 1 ${conditions}`)
}

let getFollowed = (criteria, callback) => {
   let conditions = "";

   criteria.followedId ? conditions += `and followedId = '${criteria.followedId}'` : true;

   dbConfig.getDB().query(`SELECT count(followerId) as followed  FROM follower_followed WHERE followedId  ${conditions}`, callback);
   //console.log(`SELECT count(followerId) FROM follower_followed WHERE followedId 1 ${conditions}`)
}

let getFollowerList = (criteria, callback) => {
   //console.log(criteria,"post")
   let conditions = "";

   criteria.userId ? conditions += `and followedId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`SELECT ff.followerId, u.userName,u.profilePicture FROM follower_followed ff 
    INNER JOIN user u ON ff.followerId=u.userId WHERE 1 ${conditions}`, callback)

   // console.log(`SELECT ff.followedId,ff.followerId,u.userName,u.profilePicture FROM follower_followed ff 
   //  INNER JOIN user u ON ff.followerId=u.userId WHERE  1 ${conditions}`)

}

let checkFollowBack = (criteria, callback) => {
   let conditions = "";

   criteria.followerId ? conditions += `and followerId = '${criteria.followerId}' and followedId='${criteria.followedId}'` : true;

   dbConfig.getDB().query(`SELECT count(followerId) isFollow  FROM follower_followed  WHERE  1  ${conditions}`, callback)

   // console.log(`SELECT count(followerId) isFollow  FROM follower_followed  WHERE  1  ${conditions}`);

}

let getFollowedList = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += `and followerId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select f.followedId,u.userName,u.profilePicture from 
    follower_followed as f left join user as u on u.userId=f.followedId where 1 ${conditions}`, callback)
   //dbConfig.getDB().query(`SELECT user.pro FROM follower_followed WHERE followerId  ${conditions}`, callback);
   //console.log(`SELECT count(followedId) FROM follower_followed WHERE followerId 1 ${conditions}`)
}

let getMovieList = (callback) => {
   // let conditions = "";

   // criteria.createdAt ? conditions += `and createdAt = '${criteria.createdAt}'` : true;

   //dbConfig.getDB().query(`SELECT id,original_title,poster_path FROM movieList  where 1 `, callback);
   dbConfig.getDB().query(`SELECT id,original_title,poster_path,release_date FROM movieList  where 1 ORDER BY release_date DESC `, callback);

}

let getFilterPost = (criteria, callback) => {

   let conditions = "";
   criteria.genre ? conditions += `AND pg.genre  like '%${criteria.genre}%'` : true;

   // let conditions1 = "";
   // criteria.platform ? conditions1 += `OR post.platform like '%${criteria.platform}%'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*,ph.hashtags,pg.genre,user.userName,COALESCE( user.profilePicture ,'') AS profilePicture,COALESCE(l.likeStatus ,'') AS likeStatus ,
   (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
   
   (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join user on user.userId = post.userId 
   left join post_hashtag as ph on ph.postId =post.postId
   left join post_genre as pg on pg.postId =post.postId
   left join like_Unlike as l on l.postId = post.postId WHERE 
   post.postStatus='active' ${conditions} `, callback);

   //dbConfig.getDB().query(`select postId,text,postImage,hashTag from post_hashtag where  ${conditions}`, callback);
   // console.log(`SELECT distinct post.*,ph.hashtags,pg.genre,user.userName,COALESCE( user.profilePicture ,'') AS profilePicture,COALESCE(l.likeStatus ,'') AS likeStatus ,
   // (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,

   // (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   // FROM post
   // left join user on user.userId = post.userId 
   // left join post_hashtag as ph on ph.postId =post.postId
   // left join post_genre as pg on pg.postId =post.postId
   // left join like_Unlike as l on l.postId = post.postId WHERE 
   // post.postStatus='active' ${conditions}`)
}

let getFilterPlatform = (criteria, callback) => {

   let conditions = "";
   criteria.platform ? conditions += `AND post.platform  like '%${criteria.platform}%'` : true;


   dbConfig.getDB().query(`SELECT distinct post.*,ph.hashtags,pg.genre,user.userName,COALESCE( user.profilePicture ,'') AS profilePicture,COALESCE(l.likeStatus ,'') AS likeStatus ,
   (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
   
   (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join user on user.userId = post.userId 
   left join post_hashtag as ph on ph.postId =post.postId
   left join post_genre as pg on pg.postId =post.postId
   left join like_Unlike as l on l.postId = post.postId WHERE 
   post.postStatus='active' ${conditions} `, callback);

}
//not use
let getUserPostData = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;
   let conditions1 = "";
   criteria.userId ? conditions1 += `followerId = '${criteria.userId}'` : true;
   let conditions2 = "";
   criteria.userId ? conditions2 += `l.userId = '${criteria.userId}'` : true;

   //console.log(conditions1)
   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,COALESCE( user.profilePicture ,'')  AS profilePicture,COALESCE(l.likeStatus ,'unlike')  AS likeStatus ,
   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user on user.userId = post.userId 
   left join like_Unlike as l on l.postId = post.postId AND ${conditions2} WHERE 
   ((post.userId IN
   (SELECT followedId FROM follower_followed WHERE ${conditions1})
   )
   OR 
   post.postId IN 
   (SELECT postId FROM like_Unlike WHERE 
   like_Unlike.userId IN (SELECT followedId FROM follower_followed WHERE ${conditions1} AND likeStatus = 'like')
   )
   OR ${conditions} ) AND post.postStatus='active'  ORDER BY post.createdAt DESC`, callback)

}

let getPostData = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;
   let conditions1 = "";
   criteria.userId ? conditions1 += `followerId = '${criteria.userId}'` : true;
   let conditions2 = "";
   criteria.userId ? conditions2 += `l.userId = '${criteria.userId}'` : true;

   //console.log(conditions1)
   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,

   COALESCE( user.profilePicture ,'')  AS profilePicture,

   COALESCE(l.likeStatus ,'unlike')  AS likeStatus ,

   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,

   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join user on user.userId = post.userId 
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId = user.userId
   left join like_Unlike as l on l.postId = post.postId AND ${conditions2} WHERE 
   ((post.userId IN
   (SELECT followedId FROM follower_followed WHERE ${conditions1})
   )
   OR ${conditions} ) AND post.postStatus='active' AND user.accountStatus = 'Active'  ORDER BY post.createdAt DESC`, callback)

}

let getPostData2 = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;
   let conditions1 = "";
   criteria.userId ? conditions1 += `followerId = '${criteria.userId}'` : true;
   let conditions2 = "";
   criteria.userId ? conditions2 += `l.userId = '${criteria.userId}'` : true;
   let conditions3 = "";
   criteria.genre ? conditions3 += `g.genre = '${criteria.genre}'` : true;
   // let conditions4 = "";
   // criteria.platform ? conditions4 += `post.platform = '${criteria.platform}'` : true;
   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,

   COALESCE( user.profilePicture ,'')  AS profilePicture,

   COALESCE(l.likeStatus ,'unlike')  AS likeStatus ,

   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,

   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join user on user.userId = post.userId 
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId = user.userId
   left join like_Unlike as l on l.postId = post.postId AND ${conditions2} WHERE 
   ((post.userId IN
   (SELECT followedId FROM follower_followed WHERE ${conditions1})
   )
  
   OR ${conditions} ) AND post.postStatus='active' AND ${conditions3} AND user.accountStatus = 'Active'  ORDER BY post.createdAt DESC`, callback)


}

let getPostData3 = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;
   let conditions1 = "";
   criteria.userId ? conditions1 += `followerId = '${criteria.userId}'` : true;
   let conditions2 = "";
   criteria.userId ? conditions2 += `l.userId = '${criteria.userId}'` : true;
   // let conditions3 = "";
   // criteria.genre ? conditions3 += `g.genre = '${criteria.genre}'` : true;
   let conditions4 = "";
   criteria.platform ? conditions4 += `post.platform = '${criteria.platform}'` : true;
   // console.log(criteria, "Ambuj999")
   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,

   COALESCE( user.profilePicture ,'')  AS profilePicture,

   COALESCE(l.likeStatus ,'unlike')  AS likeStatus ,

   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,

   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,
  
   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join user on user.userId = post.userId 
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId = user.userId
   left join like_Unlike as l on l.postId = post.postId AND ${conditions2} WHERE 
   ((post.userId IN
   (SELECT followedId FROM follower_followed WHERE ${conditions1})
   )
   OR ${conditions} ) AND post.postStatus='active'  AND ${conditions4} AND user.accountStatus = 'Active' ORDER BY post.createdAt DESC`, callback)


}

let getFlickData = (criteria, callback) => {
   let conditions = "";

   criteria.id ? conditions += `and id = '${criteria.id}'` : true;
   console.log(conditions, "post")

   dbConfig.getDB().query(`SELECT id,genre_ids,original_title,original_language,release_date,vote_average,poster_path,overview FROM movieList  where 1 ${conditions}`, callback);
   console.log(`SELECT id,genre_ids,original_title,original_language,release_date,vote_average,poster_path,overview FROM movieList  where 1 ${conditions}`)
}

let getUserFlick = (criteria, callback) => {
   let conditions = "";

   criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select userId,id,status, createdAt from user_flicks where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");     
}

let getUserWish = (criteria, callback) => {
   let conditions = "";

   //   criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select wishId,userId,title,language, releaseDate,poster,rating,description,  
   watchStatus from user_wishList where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");     
}

let getUserWishDetails = (criteria, callback) => {
   let conditions = "";
   criteria.wishId ? conditions += ` and wishId = '${criteria.wishId}'` : true;

   dbConfig.getDB().query(`select wishId,userId,title,language, releaseDate,poster,rating,description from user_wishList where 1 ${conditions}`, callback);
   //console.log(`select userId,userName,email,profilePicture,gender,age,location,des,api_token from user where 1 ${conditions}`,"Set Data");     
}

let getTrendingPost = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,
   COALESCE( user.profilePicture ,'') AS profilePicture,
   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,
   (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,
   COALESCE((SELECT likeStatus FROM like_Unlike WHERE postId = post.postId AND ${conditions}),'unlike') as likeStatus,
   (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join user on user.userId = post.userId 
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId =user.userId
   WHERE post.postStatus='active' AND user.accountStatus = 'Active' ORDER BY postLike DESC, comment DESC `, callback)


}

let getTrendingPost1 = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `userId = '${criteria.userId}'` : true;

   let conditions1 = "";
   criteria.genre ? conditions1 += `g.genre = '${criteria.genre}'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,
   COALESCE( user.profilePicture ,'') AS profilePicture,
   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,
   (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,
   COALESCE((SELECT likeStatus FROM like_Unlike WHERE postId = post.postId AND ${conditions}),'unlike') as likeStatus,
   (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join user on user.userId = post.userId 
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId =user.userId
   WHERE post.postStatus='active' AND ${conditions1} AND user.accountStatus = 'Active' ORDER BY postLike DESC, comment DESC `, callback)



}

let getTrendingPost2 = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += `userId = '${criteria.userId}'` : true;

   let conditions4 = "";
   criteria.platform ? conditions4 += `post.platform = '${criteria.platform}'` : true;

   dbConfig.getDB().query(`SELECT distinct post.*,user.userName, g.genre,
   COALESCE( user.profilePicture ,'') AS profilePicture,
   COALESCE(user_block.blockStatus ,'active')  AS blockStatus ,
   (SELECT COUNT( commentId ) FROM comment WHERE postId = post.postId) as comment,
   COALESCE(follower_followed.followStatus ,'false')  AS followStatus ,
   COALESCE((SELECT likeStatus FROM like_Unlike WHERE postId = post.postId AND ${conditions}),'unlike') as likeStatus,
   (SELECT COUNT( likeId ) FROM like_Unlike WHERE postId = post.postId) as postLike
   FROM post
   left join post_genre as g on g.postId = post.postId 
   left join user_block on user_block.fromUserId = '${criteria.userId}' AND user_block.toUserId = post.userId
   left join user on user.userId = post.userId 
   left join follower_followed on follower_followed.followerId = '${criteria.userId}' AND follower_followed.followedId =user.userId
   WHERE post.postStatus='active' AND ${conditions4} AND user.accountStatus = 'Active' ORDER BY postLike DESC, comment DESC `, callback)



}

let getWhatsNew = (callback) => {

   dbConfig.getDB().query(`SELECT id,original_language, original_title,poster_path,vote_average,
   release_date,overview,genre_ids FROM movieList  where 1 ORDER BY release_date DESC limit 30`, callback);
}

let getOtherPost = (criteria, callback) => {
   let conditions = "";
   let conditions1 = "";

   //criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
   criteria.userId ? conditions += `  user.userId = '${criteria.userId}'` : true;
   criteria.otherUserId ? conditions1 += ` userId = '${criteria.otherUserId}'` : true;




   dbConfig.getDB().query(`select  post.postId,post.link,post.title,post.platform,post.expression_code,

   post.expression,post.activity,post.createdAt,user.userName,user.email,COALESCE( user.profilePicture ,'') AS profilePicture,

   COALESCE((SELECT likeStatus FROM like_Unlike WHERE postId = post.postId AND ${conditions1}),'unlike') as likeStatus,

   (SELECT COUNT( commentId )  FROM comment WHERE postId = post.postId) as comment,

   (SELECT COUNT( likeId )  FROM like_Unlike WHERE postId = post.postId) as postLike

   from post INNER JOIN user ON post.userId = user.userId where  ${conditions}  AND post.postStatus='active' ORDER BY post.createdAt DESC `, callback);

}

let getSinglePost = (criteria, callback) => {

   let conditions = "";

   criteria.postId ? conditions += ` postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`select * from post where ${conditions}`, callback);


}

let getBlockUser = (criteria, callback) => {
   let conditions = "";

   criteria.fromUserId ? conditions += ` and fromUserId = '${criteria.fromUserId}'` : true;
   criteria.toUserId ? conditions += ` and toUserId = '${criteria.toUserId}'` : true;


   dbConfig.getDB().query(`select fromUserId,toUserId,blockStatus from user_block where 1 ${conditions}`, callback);
   //console.log(`select fromUserId,toUserId,blockStatus from user_block where 1 ${conditions}`, "Set Data");
}

let getBlockUserList = (criteria, callback) => {
   let conditions = "";

   criteria.fromUserId ? conditions += ` and fromUserId = '${criteria.fromUserId}'` : true;
   criteria.toUserId ? conditions += ` and toUserId = '${criteria.toUserId}'` : true;


   dbConfig.getDB().query(`select f.toUserId,f.blockStatus, u.userName,u.profilePicture from 
   user_block as f left join user as u on u.userId=f.toUserId where 1 ${conditions}`, callback);
}

let getUserAccountStatus = (criteria, callback) => {
   let conditions = "";
   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select userId,accountStatus from user where 1 ${conditions}`, callback);
}

let checkUserWhish = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select wishId,userId,genreId,title,language, releaseDate,poster,rating,description,  
   watchStatus from user_wishList where 1 ${conditions}`, callback);
}

let getUserDeviceToken = (criteria, callback) => {
   let conditions = "";

   criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;

   dbConfig.getDB().query(`select user.userId,user.userName,user.profilePicture,user.device_token,
   post.postId,post.userId,post.platform from post INNER JOIN user ON user.userId = post.userId where 1 ${conditions}`, callback);
   //dbConfig.getDB().query(`select postId,userId,userName,profilePicture,device_type,device_token from user where 1 ${conditions}`, callback);
}

let followerNotifitionData = (criteria, callback) => {
   let conditions = "";

   criteria.followedId ? conditions += ` and followedId = '${criteria.followedId}'` : true;

   dbConfig.getDB().query(`select user.userId,user.userName,user.profilePicture,user.device_token,
   follower_followed.followedId from follower_followed INNER JOIN user ON user.userId = follower_followed.followedId where 1 ${conditions}`, callback);
   //dbConfig.getDB().query(`select postId,userId,userName,profilePicture,device_type,device_token from user where 1 ${conditions}`, callback);
}

let followerData = (criteria, callback) => {
   let conditions = "";

   criteria.followedId ? conditions += ` and followedId = '${criteria.followedId}'` : true;

   dbConfig.getDB().query(`select user.userId,user.userName,user.profilePicture,user.device_token,
   follower_followed.followerId from follower_followed INNER JOIN user ON user.userId = follower_followed.followerId where 1 ${conditions}`, callback);
   //dbConfig.getDB().query(`select postId,userId,userName,profilePicture,device_type,device_token from user where 1 ${conditions}`, callback);
}

let sentPostToAllUser = (criteria1, callback) => {
   let conditions = "";

   criteria1.followerId ? conditions += `and followerId = '${criteria1.followerId}'` : true;

   dbConfig.getDB().query(`select f.followedId,u.userName,u.profilePicture,u.device_token from 
    follower_followed as f left join user as u on u.userId=f.followedId where followerId  ${conditions}`, callback)
}

let getUserFlickData = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += `userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select wishId,userId,title,language, releaseDate,poster,rating,description,genre,  
   watchStatus from user_wishList where  ${conditions}`, callback);
   // console.log(`select wishId,userId,title,language, releaseDate,poster,rating,description,genre,  
   // watchStatus from user_wishList where ${conditions}`)
}

let sentUserchoice = (criteria, callback) => {
   let conditions = "";

   criteria.genre_ids ? conditions += `genre_ids like '%${criteria.genre_ids}%'` : true;
   //console.log(conditions, "post")

   dbConfig.getDB().query(`SELECT id,original_title,poster_path FROM movieList  where  ${conditions}`, callback);
   //console.log(`SELECT id,genre_ids,original_title,original_language,release_date,vote_average,poster_path,overview FROM movieList  where  ${conditions}`)
}

let getUserCount = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += `userId = '${criteria.userId}'` : true;
   //console.log(conditions, "post")

   dbConfig.getDB().query(`SELECT COUNT(userId) AS CARDLIMIT FROM user_wishList  where  ${conditions}`, callback);
   //console.log(`SELECT id,genre_ids,original_title,original_language,release_date,vote_average,poster_path,overview FROM movieList  where  ${conditions}`)
}

// select f.followerId,u.userName,u.profilePicture, if(f.followerId in (select GROUP_CONCAT(followerId) 
//from follower_followed where followedId='1'),'true', 'false') as followStatus from 
//follower_followed as f left join user as u on u.userId=f.followerId where 1 and followedId = '1'

let getUserDataForNotification = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;


   dbConfig.getDB().query(`select userId,userName,profilePicture from user  where 1 ${conditions}`, callback);
   //dbConfig.getDB().query(`select postId,userId,userName,profilePicture,device_type,device_token from user where 1 ${conditions}`, callback);
}

//Notification List
let getNotificationList = (criteria, callback) => {
   let conditions = "";

   criteria.userId ? conditions += ` userId = '${criteria.userId}'` : true;

   dbConfig.getDB().query(`select * from notification where ${conditions} `, callback);
}

module.exports = {
   createUser: createUser,
   addPost: addPost,
   getUsers: getUsers,
   updateUser: updateUser,
   updateUserDevicetoken: updateUserDevicetoken,
   getUserById: getUserById,
   getPost: getPost,
   getPostListing: getPostListing,
   addGener: addGener,
   addUserGenre: addUserGenre,
   addHashTag: addHashTag,
   addlike: addlike,
   addBlockUser: addBlockUser,
   unlike: unlike,
   getLike: getLike,
   updateUsers: updateUsers,
   addComment: addComment,
   getComment: getComment,
   updatePost: updatePost,
   getGener: getGener,
   getHashTag: getHashTag,
   updateGener: updateGener,
   updateHashTag: updateHashTag,
   deletePost: deletePost,
   addReport: addReport,
   getfollowId: getfollowId,
   addFollower: addFollower,
   getAddFollower: getAddFollower,
   getUnfollow: getUnfollow,
   updateFollowStatus: updateFollowStatus,
   getFollowStatus: getFollowStatus,
   getHashTags: getHashTags,
   getUserProfile: getUserProfile,
   getFollower: getFollower,
   getFollowed: getFollowed,
   getFollowerList: getFollowerList,
   getFollowedList: getFollowedList,
   getPostData: getPostData,
   deletefollowed: deletefollowed,
   checkFollowBack: checkFollowBack,
   updatePostStatus: updatePostStatus,
   getActivePost: getActivePost,
   getSearch: getSearch,
   movieList: movieList,
   movie: movie,
   getMovieList: getMovieList,
   getUserGener: getUserGener,
   getUnfollowStatus: getUnfollowStatus,
   getFilterPost: getFilterPost,
   getFilterPlatform: getFilterPlatform,
   getPostData2: getPostData2,
   saveFlick: saveFlick,
   getUserFlick: getUserFlick,
   saveWishList: saveWishList,
   getFlickData: getFlickData,
   getUserWish: getUserWish,
   getPostData3: getPostData3,
   deleteWish: deleteWish,
   getTrendingPost: getTrendingPost,
   getWhatsNew: getWhatsNew,
   getUserPostData: getUserPostData,
   getOtherPost: getOtherPost,
   getSinglePost: getSinglePost,
   getSearchHashTag: getSearchHashTag,
   getTrendingPost1: getTrendingPost1,
   getTrendingPost2: getTrendingPost2,
   updateUserGener: updateUserGener,
   getBlockUser: getBlockUser,
   unblockUser: unblockUser,
   getUserAccountStatus: getUserAccountStatus,
   updateAccountStatus: updateAccountStatus,
   getBlockUserList: getBlockUserList,
   updateWatchStatus: updateWatchStatus,
   getUserWishDetails: getUserWishDetails,
   checkUserWhish: checkUserWhish,
   getUserDeviceToken: getUserDeviceToken,
   followerNotifitionData: followerNotifitionData,
   followerData: followerData,
   sentPostToAllUser: sentPostToAllUser,
   getUserFlickData: getUserFlickData,
   sentUserchoice: sentUserchoice,
   sentPostData: sentPostData,
   sentPostLikeData: sentPostLikeData,
   saveMovieUserGenre: saveMovieUserGenre,
   getUserMovieGenre: getUserMovieGenre,
   getUserCount: getUserCount,
   getUserDataForNotification: getUserDataForNotification,
   removeDeviceToken : removeDeviceToken,
   userNotification : userNotification,
   getNotificationList : getNotificationList,

}
