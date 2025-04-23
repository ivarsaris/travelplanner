const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/trips-list', (request, response) => {
    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    response.status(200).json(tripsListData);
});

app.put("/trips-list", (request, response) => {
    const newTrip = request.body.tripData;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    if (tripsListData.some((trip) => trip.id === newTrip.id)) {
        response.status(500).json({ message: `500 - trip with id ${newTrip.id} already exists`});
        
    } else {
        updatedTripsListData = [...tripsListData, newTrip];

        fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));   

        response.status(200).json({message: `200 - trip "${newTrip.title}" added to list`});
    }
});

app.use((request, response, next) => {
    if (request.method === "OPTIONS") {
        return next();
    }
    response.status(404).json({ message: "Error 404: Not found" });
});

app.listen(3000);