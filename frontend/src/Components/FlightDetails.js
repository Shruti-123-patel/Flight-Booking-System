import React from 'react';

const FlightDetails = ({ flight }) => {
    return (
        <div className="flight-details">
            <h2>{flight.From}---{flight.To}</h2>
            <p><strong>Class:</strong> {flight.Class_flight}</p>
            <p><strong>Airline:</strong> {flight.Company}</p>
            <p><strong>Arrival:</strong> {flight.Take_off_time}</p>
            <p><strong>Duration:</strong> {flight.Duration} min</p>
            <p><strong>Price:</strong> {flight.Price}</p>
        </div>
    );
};

export default FlightDetails;