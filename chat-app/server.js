const net = require("net");

const PORT = 4020;
const HOST = "172.31.42.2";
//list of all connections client/(socket duplex)  established to server 
const clientsList = [];

const server = net.createServer();

server.on("connection", (socket) => {
    console.log("A new connection to the server");
    const clientId = clientsList.length + 1;

    socket.write(`id-${clientId}`);

    clientsList.forEach((client) => {
        client.socket.write(`user : ${clientId} joined`);
    })

    socket.on("data", (data) => {
        const dataString = data.toString("utf-8");
        const id = dataString.substring(0, dataString.indexOf("-"));
        const message = dataString.substring(dataString.indexOf("-message-") + 9);
        clientsList.forEach((client, i) => {
            // socket.on("data", (info) => {
            //     console.log("connection no ::", `  ${i} `, info.toString("utf-8"));
            // })
            client.socket.write(`User : ${id}: ${message}`);
        })
    });

    clientsList.push({ id: clientId.toString(), socket: socket });
    // socket.on("end", () => {
    //     clientsList.forEach((client) => {
    //         client.socket.write(`user : ${clientId} : left the chat`);
    //     })
    // })
    //Broadcasting the message to every client when one of /any client leave 
    socket.on("close", () => {
        console.log("Client disconnected");
        clientsList.forEach((client) => {
            client.socket.write(`user : ${clientId} : left the chat`);
        })
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
})
server.listen(PORT, HOST, () => {
    console.log("opened server on address::", server.address());
});

server.on("error", (err) => {
    console.error("Server error:", err);
});
