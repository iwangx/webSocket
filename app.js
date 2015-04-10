var express=require("express");
var path=require("path");
var routes = require('./routes/index');
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'html'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
routes(app);
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
var server = require("http").createServer(app).listen(1337);
var io= require('socket.io').listen(server);
var users={};
io.sockets.on('connection', function(socket){
    socket.on('message', function(from,to,msg){
        if(to in users){
            users[to].emit('to',{from:from,msg:msg});
        }
    });
    socket.on("init",function(data){
        console.log(data+" login...");
        if(data in users){

        }else{
            users[data]= socket;
        }
    });
    socket.on('disconnect', function(){
        for(user in users){
            if(users[user].id==socket.id){
                delete users[user];
            }
        }
        console.log("Connection " + socket.id + " terminated.");
    });
});
