import React, { useEffect, useState } from 'react';
import FlightDetails from './Components/FlightDetails.js';
import './App.css';

const App = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Fetch the message from Django
      fetch(`${process.env.REACT_APP_API_URL}/get_all_flights`)
        .then(response => response.json())
        .then(data => setFlights(data.flights))
        .catch(error => console.error('Error:', error));
    }, []);


    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>{error}</p>;

    return (
        <div className="App">
            <h1>Flight Details</h1>
            {flights.length === 0 ? (
                <p>No flights available.</p>
            ) : (
                flights.map((flight, index) => (
                    <FlightDetails key={index} flight={flight} />
                ))
            )}
        </div>
    );
};

export default App;
