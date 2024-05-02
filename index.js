const { Server } = require("socket.io");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const receivedHooks = [];
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: 'myhashsecret' })

server.listen(8080, () => {
    console.log('En écoute sur *:8080');
});

handler.on('push', function (event) {
    console.log(event);
    io.emit('hook', "Un nouveau commit vient d'être envoyé !");
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function connection(ws) {
    ws.on('user', function(user){
        io.emit('connexion', user+" est connecté !");
    });


    ws.on('closing', (user)=>{
        console.log('Utilisateur déconnecté !')
        io.emit('deconnexion', user+" est déconnecté !");
    });

    ws.on('message envoyé', (message, user) => {
       console.log('Message recu: %s', message);
       io.emit('chat message', message, user);
    });

    ws.on('typing', (user)=>{
        io.emit('typing', user);
    });
});

