//Abhängigkeiten
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 3000);
app.use('/static', express.static(__dirname +'/static'));


app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'index.html'));

});

// Server startet auf Port 3000
server.listen(3000, function(){
    console.log('server start auf port 3000');
});

var nummer = 0;
var Spieler = {};
var ball;

io.on('connection', function(socket){

  socket.on('neuer Ball', function() {
      ball.x = 300;
      ball.y = 250;

  });


  socket.on('bewegungBall', function(ball){

        ball.x -= 1;
        ball.y -= 1;

  });


    socket.on('neuer Spieler', function() {
        if(nummer == 0){

        Spieler[socket.id] = {
            x: 0,
            y: 250,
        };
    }
        if(nummer == 1){
            Spieler[socket.id] = {
                x: 595,
                y: 250,
            }
        }
        nummer++;
    });


    socket.on('bewegungSpieler', function(data){
        var player = Spieler[socket.id] || {} ;

          if (data.hoch) {
            if (player.y > 0){
            player.y -= 5;
          } else {
            player.y = 0;
          }
          }

          if (data.runter) {
            if (player.y < 440) {
            player.y += 5;
          } else {
            player.y -= 0,1;
          }
          }
    });

    socket.on('disconnect', function() {
      delete Spieler[socket.id];
      nummer = 0;
    });
});

setInterval(function() {
    io.sockets.emit('status', Spieler);
    io.sockets.emit('status2', ball);
  }, 1000 / 60);


  /*
  checken ob nummer = 2 ist für spiel Start
  ab punkt XY spielneustart nummer reset bedeutet reconnect*/
