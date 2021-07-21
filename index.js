const express = require('express');
const app = express();
const http = require('http');
const mqtt = require('mqtt');
const opt = { port:1883 };
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const mqtt_client = mqtt.connect('mqtt://120.126.16.88', opt);


// Functions
function getDatetime(){
    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date in YYYY-MM-DD format
    //console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    // console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    let result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    
    // prints time in HH:MM format
    //console.log(hours + ":" + minutes);

    return result
}

mqtt_client.on('connect', function(){
    console.log('server connected to broker');
    mqtt_client.subscribe('test');
})

mqtt_client.on('message', (_, msg) => {
    console.log( getDatetime() + " > "+ msg.toString());
    // store msg to redis database
    io.sockets.emit('test', msg.toString()); // to all socket clients
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// io.on('connection', (socket) => {
//     console.log('front-end connected');
//     //socket.emit('test', "123") // correct
//     // mqtt_client.on('message', function(topic, msg){
//     //     console.log("Topic: ", topic, ", msg: ", msg.toString());
//     //     socket.emit('test', msg.toString());
//     // })
// })

server.listen(3000, () => {
    console.log('listening on *:3000');
});
