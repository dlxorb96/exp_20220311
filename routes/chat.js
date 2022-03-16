var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//웹이 아니라서 지워도 됨.

const app = express();
const http = require('http');
const httpServer = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(httpServer, {path:'/socket', cors:{origins: '*:*'}});
// 원래 proxy설정하면 cors : {origins: '*:*'} 안해줘도 되는데, 버전에 따라서 안되는 경우가 있더라

httpServer.listen(3001, ()=>{
    console.log("http:127.0.0.1:3001/socket");
})

// 클라이언트가 접속했을 수행됨
io.on('connection', (socket) =>{
    console.log("----------------");
    console.log("socket");

    // 클라이언트에서 메시지가 도착했을 때
    socket.on('publish', function(data){
        console.log(data);

        // 모든 클라이언트에 메시지를 전송함
        io.emit('subscribe', {
            userid : data.data.userid,
            username : data.data.username
        })
    } )
    
})



module.exports = router;
