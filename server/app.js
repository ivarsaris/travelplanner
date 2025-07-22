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


/**
 * =    =   =   =   =   =   =
 *
 * Trip requests
 *
 * =    =   =   =   =   =   =
 */


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
        response.status(500).json({ message: `500 - trip with ID ${updatedTrip.id} doesn't exist.` });

    } else {
        const updatedTripsListData = tripsListData.map((trip) => (trip.id === updatedTrip.id ? { ...trip, ...updatedTrip } : trip));

        fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

        response.status(200).json({ message: `200 - trip ${updatedTrip.title} updated` });
    }
});

app.patch("/trips-list/hotel/:tripId/:stopId", (request, response) => {
    const hotel = request.body.hotel;
    const tripId = request.body.tripId;
    const stopId = request.body.stopId;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));
    let targetStopName = '';

    if (!tripsListData.some(trip => trip.id === tripId)) {
        return response.status(500).json({ message: `500 - trip with ID ${tripId} doesn't exist.` });
    }

    const updatedTripsListData = tripsListData.map((trip) => {
        if (trip.id === tripId) {

            if (!trip.stops.some(stop => stop.id === stopId)) {
                return response.status(500).json({ message: `500 - stop with ID ${stopId} doesn't exist.` });
            }

            const updatedStops = trip.stops.map((stop) => {
                if (stop.id === stopId) {

                    targetStopName = stop.location.name;

                    return { ...stop, hotel: hotel };
                }
                return stop;
            });

            return { ...trip, stops: updatedStops };
        }
        return trip;
    });

    fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

    return response.status(200).json({ message: `200 - stop ${targetStopName} updated with hotel ${hotel}` });
});

/**
 * receives a delete request from the angular application and deletes the hotel from a specific stop
 *
 */
app.delete("/stop-hotel/:tripId/:stopId", (request, response) => {
    const tripId = request.params.tripId;
    const stopId = request.params.stopId;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    if (!tripsListData.some((trip) => trip.id === tripId)) {
        return response.status(500).json({ message: `500 - trip with ID ${tripId} doesn't exist.` });
    }

    const updatedTripsListData = tripsListData.map((trip) => {
        if (trip.id === tripId) {

            if (!trip.stops.some(stop => stop.id === stopId)) {
                return response.status(500).json({ message: `500 - stop with ID ${stopId} doesn't exist.` });
            }
            else {

                const updatedStops = trip.stops.map((stop) => {
                    if (stop.id === stopId) {

                        targetStopName = stop.location.name;

                        delete stop.hotel;
                    }
                    return stop;
                });

                return { ...trip, stops: updatedStops };
            }

        }

        return trip;
    });

    fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

    return response.status(200).json({ message: `200 - stop Deleted hotel from stop ${targetStopName}` });
});

/**
 * receives a delete request from the angular application and deletes the
 * activity of a certain index from a stop
 */
app.delete("/stop-activity/:tripId/:stopId/:activityIndex", (request, response) => {
    const tripId = request.params.tripId;
    const stopId = request.params.stopId;
    const activityIndex = request.params.activityIndex;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));

    if (!tripsListData.some((trip) => trip.id === tripId)) {
        return response.status(500).json({ message: `500 - trip with ID ${tripId} doesn't exist.` });
    }

    const updatedTripsListData = tripsListData.map((trip) => {
        if (trip.id === tripId) {

            if (!trip.stops.some(stop => stop.id === stopId)) {
                return response.status(500).json({ message: `500 - stop with ID ${stopId} doesn't exist.` });
            }
            else {

                const updatedStops = trip.stops.map((stop) => {
                    if (stop.id === stopId) {

                        targetStopName = stop.location.name;
                        activityName = stop.activities[activityIndex].name;

                        stop.activities.splice(activityIndex, 1);
                    }
                    return stop;
                });

                return { ...trip, stops: updatedStops };
            }

        }

        return trip;
    });

    fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

    return response.status(200).json({ message: `200 - Deleted activity ${activityName} from stop ${targetStopName}` });
});

app.put("/trips-list/activities/:tripId/:stopId", (request, response) => {
    const activity = request.body.activity;
    const tripId = request.body.tripId;
    const stopId = request.body.stopId;

    const tripsListData = JSON.parse(fs.readFileSync('./data/trips-list.json'));
    let targetStopName = '';

    if (!tripsListData.some(trip => trip.id === tripId)) {
        return response.status(500).json({ message: `500 - trip with ID ${tripId} doesn't exist.` });
    }

    const updatedTripsListData = tripsListData.map((trip) => {
        if (trip.id === tripId) {

            if (!trip.stops.some(stop => stop.id === stopId)) {
                return response.status(500).json({ message: `500 - stop with ID ${stopId} doesn't exist.` });
            }

            const updatedStops = trip.stops.map((stop) => {
                if (stop.id === stopId) {

                    targetStopName = stop.location.name;

                    const updatedActivities = stop.activities ? [...stop.activities, activity] : [activity];

                    return { ...stop, activities: updatedActivities };
                }
                return stop;
            });

            return { ...trip, stops: updatedStops };
        }
        return trip;
    });

    fs.writeFileSync('./data/trips-list.json', JSON.stringify(updatedTripsListData));

    return response.status(200).json({ message: `200 - stop ${targetStopName} updated with activity ${activity.name}` });
});

/**
 * =    =   =   =   =   =   =
 *
 * User requests
 *
 * =    =   =   =   =   =   =
 */

/**
 * retreive list of users through a get request
 */
app.get('/users-list', (request, response) => {
    const usersListData = JSON.parse(fs.readFileSync('./data/users-list.json'));

    response.status(200).json(usersListData);
});

/**
 * add user to users list through a put request
 */
app.put("/users-list", (request, response) => {
    const newUser = request.body.user;

    const usersListData = JSON.parse(fs.readFileSync('./data/users-list.json'));

    if (usersListData.some((user) => user.id === newUser.id)) {
        response.status(500).json({ message: `500 - user with id ${newUser.id} already exists`});

    } else {
        const updatedUsersListData = [...usersListData, newUser];

        fs.writeFileSync('./data/users-list.json', JSON.stringify(updatedUsersListData));

        response.status(200).json({message: `200 - User "${newUser.username}" added to list`});
    }
});


app.use((request, response, next) => {
    if (request.method === "OPTIONS") {
        return next();
    }
    response.status(404).json({ message: "Error 404: Not found" });
});

app.listen(3000);
