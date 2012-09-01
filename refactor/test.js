var redis = require('redis').createClient();
var game = require('./game.js');
var express = require('express'); //express 3.0.0
var app = express();
var server = app.listen(8080);
var socketio = require('socket.io').listen(server);


... *some more code here for routing, socket.io, etc.*


validateNickname(nickname, function(error,errorMessage){
    if (error){
        socket.emit('error',error, errorMessage);
    } else {

//Check if client's nickname is already taken
redis.hset('players', nickname.toUpperCase(), nickname, function(error, response){
    if(error) {
        game.databaseError(socket);
    } else if (response.toString() == '0'){
        socket.emit('error','nicknameTaken', 'Sorry, that nickname is already in use. Please try another one.');
    } else {            

//Add them to the database otherwise
redis.hset('socketID', socket.id.toString(), nickname.toUpperCase(), function(error, response){
    if(error) {
        game.databaseError(socket);
    } else {        

//Move the client to the lobby
socket.join('lobby');
socket.emit('ui','moveToLobby',nickname);

redis.hset('whereIs', nickname.toUpperCase(), 'lobby', function(error, response){
    if(error){
        game.databaseError(socket);
    } else {

socketio.sockets.in('lobby').emit('lobby','numPlayers',numPlayers);

}}); //redis.hset
}}); //redis.hset
}}); //redis.hset
}}); //validateNickname
