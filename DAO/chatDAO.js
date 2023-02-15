
let dbConfig = require("../Utilities/dbConfig");

let getHomeData = (criteria,callback) => {
    let conditions = "";

    criteria.userId ? conditions += ` AND userId = ${criteria.userId}` : true;
    //criteria.peerId ? conditions += ` AND peerId = ${criteria.peerId}` : true;

   // dbConfig.getDB().query(`SELECT user.userId, user.userName, user.profilePicture, recent_chat.message, recent_chat.date_added FROM users as user JOIN (SELECT c2.userId, c1.id, c1.message, c1.date_added FROM chat as c1 JOIN (SELECT MAX(chat.id) as chatId, if(chat.sender_id = ${criteria.userId}, chat.receiver_id,chat.sender_id) as userId FROM chat AS chat WHERE ${criteria.userId} IN (chat.sender_id, chat.receiver_id) GROUP BY userId) as c2 ON c1.id = c2.chatId)as recent_chat ON user.userId = recent_chat.userId order by recent_chat.id desc`, callback);   
   dbConfig.getDB().query(`SELECT user.userId, user.userName, user.profilePicture, recent_chat.message, recent_chat.date_added,IFNULL(user_block.blockStatus,"active") AS "blockStatus" FROM user as user 
   JOIN (SELECT c2.userId, c1.id, c1.message, c1.date_added FROM chat as c1 JOIN 
   (SELECT MAX(chat.id) as chatId, if(chat.sender_id = ${criteria.userId}, chat.receiver_id,chat.sender_id) 
   as userId FROM chat AS chat WHERE  ${criteria.userId} IN 
   (chat.sender_id, chat.receiver_id) and chat.status='active' 
   GROUP BY userId) as c2 ON c1.id = c2.chatId)as recent_chat ON 
   user.userId = recent_chat.userId 
   LEFT JOIN user_block ON ${criteria.userId} = user_block.fromUserId AND user.userId = user_block.toUserId OR

   user.userId = user_block.fromUserId AND ${criteria.userId} = user_block.toUserId

   WHERE IFNULL(user_block.blockStatus,"active") = 'active' order by recent_chat.id desc`, callback);   

  // console.log(`SELECT user.userId, user.userName, user.profilePicture, recent_chat.message, recent_chat.date_added FROM users as user JOIN (SELECT c2.userId, c1.id, c1.message, c1.date_added FROM chat as c1 JOIN (SELECT MAX(chat.id) as chatId, if(chat.sender_id = ${criteria.userId}, chat.receiver_id,chat.sender_id) as userId FROM chat AS chat WHERE ${criteria.userId} IN (chat.sender_id, chat.receiver_id) GROUP BY userId) as c2 ON c1.id = c2.chatId)as recent_chat ON user.userId = recent_chat.userId order by recent_chat.id desc`);
}
//LEFT JOIN user_block ON  chat.sender_id = user_block.toUserId or chat.receiver_id = user_block.toUserId
//WHERE IFNULL(user_block.blockStatus,"active") = 'active'
let chatGet = (criteria,callback) => {

    let conditions = "";

    criteria.sender_id ? conditions += ` and sender_id = ${criteria.sender_id}` : true;
    criteria.receiver_id ? conditions += ` and receiver_id = ${criteria.receiver_id}` : true;
    //criteria.limit ? conditions += ` and limit = ${criteria.limit}` : true;
    ///criteria.offset ? conditions += ` and offset = ${criteria.offset}` : true;

    dbConfig.getDB().query(`SELECT chat.sender_id,chat.receiver_id, chat.message as message, chat.date_added, IFNULL(user_block.blockStatus,"active") AS "blockStatus" FROM 
    chat as chat 
    LEFT JOIN user_block ON  chat.receiver_id = user_block.toUserId AND chat.sender_id = user_block.fromUserId OR

    chat.sender_id = user_block.toUserId AND chat.receiver_id = user_block.fromUserId

    WHERE (chat.sender_id = ${criteria.sender_id} AND chat.receiver_id = ${criteria.receiver_id}) OR 
    (chat.sender_id = ${criteria.receiver_id} AND chat.receiver_id = ${criteria.sender_id})  
    order by chat.date_added ASC `, callback);   

    //console.log(`SELECT chat.sender_id, chat.message as message, chat.date_added FROM chat as chat WHERE (chat.sender_id = ${criteria.sender_id} AND chat.receiver_id = ${criteria.receiver_id}) OR (chat.sender_id = ${criteria.receiver_id} AND chat.receiver_id = ${criteria.sender_id}) order by chat.id DESC LIMIT ${criteria.limit} OFFSET ${criteria.offset}`);
}

let updateSyncStatus = (criteria, dataToSet2, callback) => {

    let setData = "";
    let conditions = "";

    criteria.sender_id ? conditions += ` AND ( sender_id = ${criteria.sender_id} OR receiver_id = ${criteria.sender_id} )` : true;
    criteria.receiver_id ? conditions += ` AND (receiver_id = ${criteria.receiver_id} OR sender_id = ${criteria.receiver_id} )` : true;

    //update data
    dataToSet2.status ? setData += `  status = '${dataToSet2.status}'` : true;

    //query
    dbConfig.getDB().query(`UPDATE chat SET ${setData} where 1 ${conditions}`,callback);
    //console.log(`UPDATE chat SET ${setData} where 1 ${conditions}`);
}

module.exports = {
    getHomeData : getHomeData,
    chatGet : chatGet,
    updateSyncStatus : updateSyncStatus
};
