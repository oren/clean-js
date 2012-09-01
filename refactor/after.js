1. return when you encounter an error instead of using if/else, kills a level of nesting.
2. Use redis.multi() where possible. Since your game is fucked anyway if Redis goes down, might as well combine those last 2 sets to kill more nesting.
3. Break stuff out into separate functions where possible.

1 & 2:
validateNickname(nickname, function(err, message) {
  if (err) return socket.emit('error', err, message)
  redis.hset('players', nickname.toUpperCase(), nickname, function(err, reply) {
    if (err) return game.databaseError(socket)
    if (reply == '0') return socket.emit('error', 'nicknameTaken', 'Sorry, that nickname is already in use. Please try another one.')
    var multi = redis.multi()
    multi.hset('socketID', socket.id.toString(), nickname.toUpperCase())
    multi.hset('whereIs', nickname.toUpperCase(), 'lobby')
    multi.exec(function(err) {
      if (err) return game.databaseError(socket)
      socket.join('lobby')
      socket.emit('ui', 'moveToLobby', nickname)
      socketio.sockets.in('lobby').emit('lobby','numPlayers',numPlayers)
    })
  })
})

1, 2 & 3:
validateNickname(nickname, function(err, message) {
  if (err) return socket.emit('error', err, message)
  redis.hset('players', nickname.toUpperCase(), nickname, function(err, reply) {
    if (err) return game.databaseError(socket)
    if (reply == '0') return socket.emit('error', 'nicknameTaken', 'Sorry, that nickname is already in use. Please try another one.')
    moveToLobby(socket, nickname)
  })
})

function moveToLobby(socket, nickname) {
  var multi = redis.multi()
  multi.hset('socketID', socket.id.toString(), nickname.toUpperCase())
  multi.hset('whereIs', nickname.toUpperCase(), 'lobby')
  multi.exec(function(err) {
    if (err) return game.databaseError(socket)
    socket.join('lobby')
    socket.emit('ui', 'moveToLobby', nickname)
    socketio.sockets.in('lobby').emit('lobby', 'numPlayers', numPlayers)
  })
}
