const fs = require('fs');
const express = require('express');
const app = express();

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/trips-list', (request, response) => {
    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    response.status(200).json({ tripsList: tripsListData });
});

app.use((request, response, next) => {
    if (request.method === "OPTIONS") {
        return next();
    }
    response.status(404).json({ message: "Error 404: Not found" });
});

app.listen(3000);