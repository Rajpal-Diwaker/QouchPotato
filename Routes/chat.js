let express = require('express'),
    router = express.Router(),
    util = require('../Utilities/util'),
    chat = require('../Services/chat');


//user init chat
router.post('/chatList', (req, res) => {
    chat.chatHome(req.body, (data) => {
        res.send(data);
    });
});

router.post('/getChatMessage', (req, res) => {
    chat.getChatMessage(req.body, (data) => {
        res.send(data);
    });
});


module.exports = router;
