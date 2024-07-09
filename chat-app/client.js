const net = require("net");
const readline = require("node:readline/promises");
const { resolve } = require("path");
const dns = require('node:dns');
const dnsPromises = dns.promises;
const PORT = 4020;
const HOST = "ec2-13-233-149-95.ap-south-1.compute.amazonaws.com";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const clearLine = (dir) => {
    return new Promise((resolve, rejects) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        })
    })

}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, rejects) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        })
    })

}

let id;

//client below is socket which is a duplex connection stream in itself
const client = net.createConnection({ host: HOST, port: PORT }, async () => {
    console.log("connected to the server!");


    dnsPromises.lookup(HOST).then((result) => {
        // console.log(result);
        // address: "2606:2800:220:1:248:1893:25c8:1946" family: IPv6
    });

    const ask = async () => {
        const message = await rl.question("Enter a message >");
        await moveCursor(0, -1);//move the cursor one line up
        await clearLine(0);//clear the current line of the cursor
        client.write(`${id}-message-${message}`);
    }
    ask();

    client.on("data", async (data) => {
        console.log();
        await moveCursor(0, -1);
        await clearLine(0);//clear the current line of the cursor
        if (data.toString("utf-8").substring(0, 2) === "id") {//when we are getting id from client

            id = data.toString("utf-8").substring(3);
            console.log(`Your id is ${id} ! \n`);
        }
        else {
            console.log(data.toString("utf-8"));
        }
        ask();


    })

});


client.on("end", () => {
    console.log("disconnected from server");
});

client.on("close", () => {
    console.log("Connection was ended");
});

client.on("error", (err) => {
    console.error("Connection error:", err);
});
