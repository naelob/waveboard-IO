const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
require("dotenv").config();

app.use(express.static(__dirname + "/public" ));


app.get("/",function(req,res){
    res.sendFile("index.html");
});

const users = [];
io.on("connection", function(socket){
    console.log("utlisateur connecté");
    socket.on("dessin",function(data){
        socket.broadcast.emit("dessin",data);   
    });
    socket.on("new user",function(name) {
        users[socket.id] = name;
        socket.broadcast.emit("new user",name);
    });
    socket.on("new message",function(message) {
        
        io.emit("new message",{author:users[socket.id],message: message });
    });
    socket.on("typing",function(msg) {
        socket.broadcast.emit("typing",{name: users[socket.id],message: msg});
    });
});

const port = process.env.PORT || 3000; 

http.listen(port,function(){
    console.log("ca marche bien!");
});