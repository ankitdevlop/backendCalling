const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        io.emit('callended');
    });

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
