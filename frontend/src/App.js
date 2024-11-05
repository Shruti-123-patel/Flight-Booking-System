import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  // return (
  //   <div className="App">

  //     {/* <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header> */}
  //   </div>
  // );
  const [message, setMessage] = useState([]);

  useEffect(() => {
    // Fetch the message from Django
    fetch(`${process.env.REACT_APP_API_URL}/flight`)
      .then(response => response.json())
      .then(data => setMessage(data.flights))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <h1>{message?message[4]['id']:'hello'}</h1>
    </div>
  );
}

export default App;
