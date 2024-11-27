import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/FlightResultPage.css'; 
import { Modal, Button } from 'react-bootstrap'; 
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const FlightResultsPage = () => {
    const location = useLocation();
    const data = (location.state?.flights || []).flights;
    const [flights, setFlights] = useState([]);
    const [flightsAll , setFlightsAll] = useState([])
    // console.log(data)

    const [showModal, setShowModal] = useState(false);

    const [showModal2, setShowModal2] = useState(false);
    
    const [selectedFlight, setSelectedFlight] = useState([]);
    const [analyzeData , setAnalyzeData] = useState(false)

    const handleModalOpen = (flight) => {
        console.log(flight)
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
        setShowModal2(false);
        setSelectedFlight(null);
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setFlights(data);
            setFlightsAll(data);
            console.log(flights)
        } else {
            setFlights([]);  
        }
    }, [data]);

    const handleCheckbox_Stop = (e)=> {
        var new_f = flightsAll;
        if(e.target.value==="NonStop"){
            new_f = flightsAll.filter(f => f.NumStop === "Non-Stop");
        }
        else if(e.target.value==="OneStop"){
            new_f = flightsAll.filter(f => f.NumStop === "1 Stop");
        }
        setFlights(new_f)
    }
   

    const handleGraph = (e)=>{
        setAnalyzeData(true);
        setShowModal2(true);
        const uniqueAirlines = [...new Set(flightsAll.map(flight => flight.Company))];
        const colors = ["blue", "green", "red", "orange", "purple", "cyan"];
        const airlineColors = uniqueAirlines.reduce((acc, airline, index) => {
            acc[airline] = colors[index % colors.length]; // Use modulo to cycle through colors if there are more airlines than colors
            return acc;
          }, {})
        const groupedData = Object.keys(airlineColors).map((airline) => ({
            label: airline,
            backgroundColor: airlineColors[airline],
            data: flights
            .filter((flight) => flight.Company === airline)
            .map((flight) => ({ x: flight.Fid, y: flight.Price })),
        }));
        const ctx = document.getElementById("flightChart")?.getContext("2d");
        console.log(ctx)
        if (ctx) {
            new Chart(ctx, {
              type: "scatter",
              data: {
                datasets: groupedData,
              },
              options: {
                plugins: {
                  title: {
                    display: true,
                    text: ` Price Analysis`,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Flight ID",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Price (₹)",
                    },
                  },
                },
              },
            });
          }
        }

    const handleSortingDuration = (e)=>{
        var newf = flights.sort((a, b) => {
            return a.Duration - b.Duration;
          });
        setFlights(newf);
    }

    return (
        <div>
            <div class="filter-section">
                <label>
                    <input type="radio" name="filter" value="NonStop" class="filter-checkbox" onChange={handleCheckbox_Stop}/>
                    Non-Stop
                </label>
                <label>
                    <input type="radio" name="filter" value="OneStop" class="filter-checkbox" onChange={handleCheckbox_Stop}/>
                    One-Stop
                </label>
                <label>
                    <input type="radio" name="filter" value="All" class="filter-checkbox" onChange={handleCheckbox_Stop}/>
                    All
                </label>
                <Button variant="primary" onClick={handleSortingDuration}>
                    Sort Duration Wise
                </Button>
            </div>

            <h2>Available Flights</h2>
            <div className="flight-cards-container">
                {flights.length > 0 ? (
                    flights.map((flight) => (
                        <div className="flight-card d-flex" key={flight.Fid} onClick={() => handleModalOpen(flight.Fid)}>
                            <h3>{flight.Company}</h3>
                            <p><strong>From:</strong> {flight.From}</p>
                            <p><strong>To:</strong> {flight.To}</p>
                            <p><strong>Take Off:</strong> {flight.Take_off_time}</p>
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
            <div>
                <Button className='btn btn-dark' onClick={handleGraph}>Analyze Flights</Button>
            </div>
            {/* {analyzeData && (
                <Modal show={showModal2} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Price Analysis</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> */}
                        <h1> Shruti </h1>
                    <canvas id="flightChart" width="800" height="400"></canvas>
                    {/* </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            )} */}
        </div>
    );
};

export default FlightResultsPage;
