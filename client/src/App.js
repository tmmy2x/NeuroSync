import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(res => setMessage(res.data))
      .catch(err => console.error('API error:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧠 NeuroSync Dashboard</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;

