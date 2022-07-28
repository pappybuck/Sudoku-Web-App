import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import Album from './Album';
import path from 'path';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Album path='http://localhost:8081/' />
      </header>
    </div>
  );
}

export default App;

