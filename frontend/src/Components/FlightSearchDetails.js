import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/FlightResultPage.css'; 
import { Modal, Button } from 'react-bootstrap'; 

const FlightResultsPage = () => {
    const location = useLocation();
    const data = (location.state?.flights || []).flights;
    const [flights, setFlights] = useState([]);
    console.log(data)

    const [showModal, setShowModal] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState([]);
    

    const handleModalOpen = (flight) => {
        fetch(`${process.env.REACT_APP_API_URL}/find_fight_data?fid=${flight}`).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setSelectedFlight(data.flights);

            setShowModal(true);
          })

    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedFlight(null);
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setFlights(data);
            console.log(flights)
        } else {
            setFlights([]);  
        }
    }, [data]);

    return (
        <div>
            <h2>Available Flights</h2>
            <div className="flight-cards-container">
                {flights.length > 0 ? (
                    flights.map((flight) => (
                        <div className="flight-card" key={flight.Fid} onClick={() => handleModalOpen(flight.Fid)}>
                            <h3>{flight.Company}</h3>
                            <p><strong>From:</strong> {flight.From}</p>
                            <p><strong>To:</strong> {flight.To}</p>
                            <p><strong>Take Off:</strong> {new Date(flight.Take_off_time).toLocaleString()}</p>
                            <p><strong>Duration:</strong> {flight.Duration} mins</p>
                        </div>
                    ))
                ) : (
                    <p>No flights found for the selected criteria.</p>
                )}
            </div>
            {selectedFlight && (
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedFlight.Company} Flight Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedFlight.length > 0 ? (
                            selectedFlight.map((flight) => (
                                <div className="flight-card" key={flight.Fid} onClick={() => handleModalOpen(flight.Fid)}>
                                    {/* <h3>{flight.Company}</h3> */}
                                    <p><strong>Class:</strong> {flight.Class_flight} </p>
                                    <p><strong>Price:</strong> {flight.Price} </p>
                                </div>
                            ))
                        ) : (
                            <p>No flights found for the selected criteria.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default FlightResultsPage;