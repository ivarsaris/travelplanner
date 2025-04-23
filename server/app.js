const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
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
        const updatedTripsListData = [...tripsListData, newTrip];

        fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));   

        response.status(200).json({message: `200 - trip "${newTrip.title}" added to list`});
    }
});

app.delete("/trips-list/:id", (request, response) => {
    const tripId = request.params.id;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    if (!tripsListData.some((trip) => trip.id === tripId)) {
        response.status(500).json({message: `500 - trip with ID ${tripId} doesn't exist.`});

    } else {
        const updatedTripsListData = tripsListData.filter(trip => trip.id !== tripId);

        fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

        response.status(200).json({message: `200 - trip with id ${tripId} deleted from list`});
    }
});

app.patch("/trips-list/:id", (request, response) => {
    const updatedTrip = request.body.tripData;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    if (!tripsListData.some(trip => trip.id === updatedTrip.id)) {
        response.status(500).json({message: `500 - trip with ID ${updatedTrip.id} doesn't exist.`});

    } else {
        const updatedTripsListData = tripsListData.map((trip) => (trip.id === updatedTrip.id ? {...trip, ...updatedTrip} : trip));

        fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

        response.status(200).json({message: `200 - trip ${updatedTrip.title} updated`});
    }
});

app.use((request, response, next) => {
    if (request.method === "OPTIONS") {
        return next();
    }
    response.status(404).json({ message: "Error 404: Not found" });
});

app.listen(3000);