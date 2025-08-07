# Travel Planner

This is an application for planning your next trip. The frontend is made with Angular, and the backend is a simple Node.js server. The data is stored in json files. You can create your own personal trips, or get inspiration from recommended trips. You can add stops to your trips, and for each stop, you can add a hotel and activities which are fetched from the Google Maps Places API.

## Features

- **User Authentication**: Users can register and log in to their accounts.
- **Trip Management**: Create, edit, and delete personal trips. Admins can edit any recommended trip.
- **Recommended Trips**: View a list of recommended trips.
- **Interactive Map**: View your trip route on an interactive map.
- **Stop Details**: Add and view details for each stop, including a hotel and activities. Users can edit the stops of trips they've created. Admins can edit stops for any recommended trip.
- **Role-based Access Control**: Admins have the ability to edit and delete recommended trips.

## Requirements

- Node.js (v18.18.0 or higher recommended)
- npm (v10.2.0 or higher recommended)
- Angular CLI (v17.2.2 or higher recommended)

## Installation

### Frontend

1. Navigate to the root directory of the project.
2. Run `npm install` to install the required dependencies.

### Server

1. Navigate to the `server` directory.
2. Run `npm install` to install the required dependencies.

## Running the Project

1. From the root directory, run `npm start`. This will start both the frontend and the server concurrently.
2. The frontend will be available at `http://localhost:4200/`.
3. The server will be running on `http://localhost:3000/`.

## API Key

This project uses the Google Maps API. You will need to provide your own API key. In the `index.html` file, you will find the following line:

```html
<script src="https://maps.googleapis.com/maps/api/js?key={{GOOGLE_MAPS_API_KEY}}&libraries=places,directions,geocoding"></script>
```

Replace `{{GOOGLE_MAPS_API_KEY}}` with your actual Google Maps API key.

### API Key requirements:

Create an API key in your account on console.cloud.google.com. The API key needs to be restricted with at least the following restrictions:

- Maps Elevation API
- Maps Embed API
- Geocoding API
- Geolocation API
- Maps JavaScript API
- Maps Static API
- Street View Static API
- Routes API
- Navigation SDK
- Address Validation API
- Route Optimization API

## Icons

This project uses the `MatIconModule` for icons. You can find a list of all available icons at [https://fonts.google.com/icons](https://fonts.google.com/icons).

## Notifications

This application includes a notification system to display messages to the user. To show a notification, inject the `NotificationService` into your component and call the `showNotification` method.
