import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlightSearchForm from './Components/FlightSearchForm';
import FlightSearchDetails from './Components/FlightSearchDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {


    return (
    
        <Router>
            <Routes>
            <Route path="/" element={<FlightSearchForm />} />
            <Route path="/results" element={<FlightSearchDetails />} />
            </Routes>
        </Router>
        
    );
};

export default App;
