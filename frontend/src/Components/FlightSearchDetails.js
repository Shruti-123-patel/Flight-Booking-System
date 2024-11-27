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
        //   const groupedData = uniqueAirlines.map((airline) => ({
        //     label: airline,
        //     backgroundColor: airlineColors[airline],
        //     data: flightsAll
        //       .map((f, index) => ({ index, ...f })) // Add index to each flight
        //       .filter((f) => f.Company === airline)
        //       .map((f) => ({ x: [int(t.split(":")[0]) + int(t.split(":")[1])/60 for t in (datetime.strptime(f.Take_off_time, "%I:%M %p").strftime("%H:%M"))], y: f.Price })), // Use index for X-axis
        //   }));
        const groupedData = uniqueAirlines.map((airline) => ({
            label: airline,
            backgroundColor: airlineColors[airline],
            data: flightsAll
              .map((f, index) => ({ index, ...f })) // Add index to each flight
              .filter((f) => f.Company === airline)
              .map((f) => {
                // Convert 12-hour time to decimal time
                const [hours, minutes] = f.Take_off_time
                  .match(/(\d+):(\d+)\s*(AM|PM)/) // Extract hours, minutes, and period (AM/PM)
                  .slice(1, 3)
                  .map(Number); // Convert to numbers
                const isPM = /PM/.test(f.Take_off_time);
                const decimalTime = isPM && hours !== 12 ? hours + 12 + minutes / 60 : hours % 12 + minutes / 60;
          
                return { x: f.index, y: f.Price };
              }),
          }));
          
          console.log(groupedData)
    
          
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
                    text: "Flight Prices by Airlines",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Flights (Sequential Order)",
                    },
                    ticks: {
                      callback: function (value) {
                        return flights[value]?.airline || value;
                      },
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
          const section = document.getElementById("last");
          section.scrollIntoView({ behavior: 'smooth' });
        }
      

    const handleSortingDuration = (e)=>{
        var newf = flights.sort((a, b) => {
            return a.Duration - b.Duration;
          });
        setFlights(newf);
    }

    return (
        <div>
           
            <div className="navbar navbar-expand-lg navbar-light bg-light sticky-top pt-3 pb-3">
                <div className="container">
                    <a className="navbar-brand" href="#">Flight Filter</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <label className="nav-link">
                                    <input type="radio" name="filter" value="NonStop" className="filter-checkbox" onChange={handleCheckbox_Stop} />
                                    Non-Stop
                                </label>
                            </li>
                            <li className="nav-item">
                                <label className="nav-link">
                                    <input type="radio" name="filter" value="OneStop" className="filter-checkbox" onChange={handleCheckbox_Stop} />
                                    One-Stop
                                </label>
                            </li>
                            <li className="nav-item">
                                <label className="nav-link">
                                    <input type="radio" name="filter" value="All" className="filter-checkbox" onChange={handleCheckbox_Stop} />
                                    All
                                </label>
                            </li>
                        </ul>
                        {/* <button className="btn btn-primary" onClick={handleSortingDuration}>Sort Duration Wise</button> */}

                        <button className="btn" onClick={handleGraph}>View Analysis</button>
                        {/* <button className="btn btn-primary" onClick={handleSortingDuration}>View Price Analysis</button> */}
                    </div>
                </div>
            </div>


            <h2>Available Flights</h2>
            <div className="flight-cards-container">
                {flights.length > 0 ? (
                    flights.map((flight) => (
                        <div className="flight-card d-flex" key={flight.Fid} >
                            <h3>{flight.Company}</h3>
                            <p><strong>{flight.From}</strong> </p>
                            <p>Take of:<br></br> <strong>{flight.Take_off_time}</strong> </p>
                            <div class="flight-duration">
                                <p>{flight.Duration} mins</p>
                                <div class="arrow-container">
                                    <div class="arrow"></div>
                                    <div class="moving-arrow"></div>
                                </div>
                                <p class="stop-status">{flight.NumStop}</p>
                            </div>
                            <p>Departure:<br></br> <strong>{flight.Departure_time}</strong> </p>
                            <p><strong>{flight.To}</strong> </p>
                            {/* <p><strong>₹</strong>{flight.Price}</p> */}
                            <button className="btn btn-primary" onClick={() => handleModalOpen(flight.Fid)}>
                                View Details
                            </button>
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
            <div id="last">
                {/* <Button className='btn btn-dark' onClick={handleGraph}>Analyze Flights</Button> */}
            
            {/* {analyzeData && (
                <Modal show={showModal2} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Price Analysis</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> 
                        <h1> Shruti </h1> */}
                    <canvas  id="flightChart" width="800" height="400"></canvas>
                    {/* </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal> */}
            {/* )}  */}
            </div>
        </div>
    );
};

export default FlightResultsPage;
