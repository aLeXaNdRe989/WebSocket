const { Server } = require("socket.io");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const receivedHooks = [];

server.listen(8080, () => {
    console.log('En écoute sur *:8080');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/https://github.com/aLeXaNdRe989/WebSocket/webhooks', (req, res) => {
    const data = req.body;
    receivedHooks.push(data);
    console.log(data);
    res.json({ message: 'Valeur reçue avec succès' });
    io.emit('hook', "Un nouveau commit vient d'être envoyé !");
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

