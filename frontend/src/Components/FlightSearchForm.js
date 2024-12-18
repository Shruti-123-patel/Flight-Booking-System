import React, { useEffect, useState } from 'react';
import '../css/FlightSearchForm.css';
import { useNavigate } from 'react-router-dom';

const FlightSearchForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name} changed to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      // console.log(data);
      navigate('/results', { state: { flights: data } });
    } catch (error) {
      console.log("Error while searching:", error);
    }
  };

  const [To_array, setTo_array] = useState([]);
  const [From_array, setFrom_array] = useState([]);

  const f = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/get_To`);
    const data = await response.json();
    setTo_array(data.st);

    const response_ = await fetch(`${process.env.REACT_APP_API_URL}/get_From`);
    const data_ = await response_.json();
    setFrom_array(data_.st);
  };

  useEffect(() => {
    f();
  }, []);

  return (
    <div className="form-container">
      <h2>Search Flights</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from">From</label>
          {/* <select
            id="from"
            name="from"
            value={formData.from} // Sync with formData
            onChange={handleChange} // Update formData on change
          >
            <option value="" disabled>Select departure</option>
            {From_array.length > 0 ? (
              From_array.map((plt) => (
                <option key={plt} value={plt}>
                  {plt}
                </option>
              ))
            ) : (
              <option value="empty">No flights Available</option>
            )}
          </select> */}
          <input type ="text" name="from" onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="to">To</label>
          {/* <select
            id="to"
            name="to"
            value={formData.to} // Sync with formData
            onChange={handleChange} // Update formData on change
          >
            <option value="" disabled>Select destination</option>
            {To_array.length > 0 ? (
              To_array.map((plt) => (
                <option key={plt} value={plt}>
                  {plt}
                </option>
              ))
            ) : (
              <option value="empty">No flights Available</option>
            )}
          </select> */}
          <input type ="text" name="to" onChange={handleChange}/>

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
