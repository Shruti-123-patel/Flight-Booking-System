import React, { useState } from 'react';
import '../css/FlightSearchForm.css';
import { useNavigate } from 'react-router-dom'

const FlightSearchForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Search data:', formData);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/find_flight_date`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();  
        console.log(data);
        navigate('/results', { state: { flights: data } });
    } catch (error) {
        console.log("Error while searching:", error);
    }
};


  return (
    <div className="form-container">
      <h2>Search Flights</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from">From</label>
          <input
            type="text"
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder="Enter departure location"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="to">To</label>
          <input
            type="text"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="Enter destination"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Search</button>
      </form>
    </div>
  );
};

export default FlightSearchForm;


