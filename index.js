const express = require('express');
const app = express();
const http = require('http');
const mqtt = require('mqtt');
const opt = { port:1883 };
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const mqtt_client = mqtt.connect('mqtt://120.126.16.88', opt);

mqtt_client.on('connect', function(){
    console.log('server connected to broker');
    mqtt_client.subscribe('test');
})

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log('front-end connected');
    //socket.emit('test', "123") // correct
    mqtt_client.on('message', function(topic, msg){
        console.log("Topic: ", topic, ", msg: ", msg.toString());
        socket.emit('test', msg.toString());
    })
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});
