import { Trip } from "./trip.model";

export const tripsList: Trip[] = [
  {
    id: '1',
    image: 'assets/images/european-tour.jpg',
    title: 'European City Tour',
    description: 'Explore the beautiful cities of Europe from Antwerp to Zurich',
    duration: '7 days',
    stops: [
      {
        order: '1',
        location: {
          name: 'Antwerp',
          address: 'Antwerp, Belgium',
          googlePlaceId: 'ChIJfYjDv472w0cRuIqogoRErz4',
          lat: 51.219448,
          lng: 4.402464,
          image: 'assets/images/antwerp.jpg'
        }
      },
      {
        order: '2',
        location: {
          name: 'Brussels',
          address: 'Brussels, Belgium',
          googlePlaceId: 'ChIJZ2jHc-2kw0cRpwJzeGY6i8E',
          lat: 50.8503,
          lng: 4.3517,
          image: 'assets/images/brussels.jpg'
        }
      },
      {
        order: '3',
        location: {
          name: 'Luxembourg City',
          address: 'Luxembourg City, Luxembourg',
          googlePlaceId: 'ChIJVyzznc1IlUcREG0F0dbRAAQ',
          lat: 49.6116,
          lng: 6.1319,
          image: 'assets/images/luxembourg.jpg'
        }
      },
      {
        order: '4',
        location: {
          name: 'Zurich',
          address: 'Zurich, Switzerland',
          googlePlaceId: 'ChIJGaK-SZcLkEcRA9wf5_GNbuY',
          lat: 47.3769,
          lng: 8.5417,
          image: 'assets/images/zurich.jpg'
        }
      }
    ]
  },
  {
    id: '2',
    image: 'assets/images/southwest-adventure.jpg',
    title: 'Southwest USA Adventure',
    description: 'Experience the natural wonders of the American Southwest',
    duration: '5 days',
    stops: [
      {
        order: '1',
        location: {
          name: 'Las Vegas',
          address: 'Las Vegas, Nevada',
          googlePlaceId: 'ChIJ0X31pIK3voARo3mz1ebVzDo',
          lat: 36.1699,
          lng: -115.1398,
          image: 'assets/images/las-vegas.jpg'
        }
      },
      {
        order: '2',
        location: {
          name: 'Grand Canyon',
          address: 'Grand Canyon, Arizona',
          googlePlaceId: 'ChIJjeAnvVQGzIARjS7UQkRVwrE',
          lat: 36.0544,
          lng: -112.1401,
          image: 'assets/images/grand-canyon.jpg'
        }
      },
      {
        order: '3',
        location: {
          name: 'Bryce Canyon',
          address: 'Bryce Canyon, Utah',
          googlePlaceId: 'ChIJLevDAsZrNYcRBm2svvvY6Ws',
          lat: 37.5930,
          lng: -112.1871,
          image: 'assets/images/bryce-canyon.jpg'
        }
      },
      {
        order: '4',
        location: {
          name: 'Las Vegas',
          address: 'Las Vegas, Nevada',
          googlePlaceId: 'ChIJ0X31pIK3voARo3mz1ebVzDo',
          lat: 36.1699,
          lng: -115.1398,
          image: 'assets/images/las-vegas.jpg'
        }
      }
    ]
  }
];